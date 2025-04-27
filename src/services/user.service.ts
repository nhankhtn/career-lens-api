import { firebaseAdmin } from "../config/firebase";
import Topic from "../models/topic.model";
import jwt from "jsonwebtoken";
import { ApiError, StatusCodes } from "../utils/api-error";
import configEnv from "../config/env";
import User from "src/models/user.model";
import { UpdateProfilInput } from "src/controllers/user/dto/update-profile.dto";
import UserTopicProgress from "src/models/user-topic-progress.model";
import UserOnboarding from "src/models/user-onboarding";
import { JWTPayload } from "src/common/types";
import { ObjectId } from "mongodb";
import { CreateUserTopicProgressInput } from "src/controllers/user/dto/create-user-topic-progress.dto";
import { UserOnboardingInput } from "src/controllers/user/dto/user-onboarding.dto";
import Skill from "src/models/skill.model";

class UserService {
  async getUserByIdToken(idToken: string) {
    try {
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
      let user = await User.findOne({
        email: decodedToken.email,
      });
      if (!user && decodedToken.provider_id !== "anonymous") {
        const newUser = new User({
          name: decodedToken.name || decodedToken.email,
          email: decodedToken.email,
          phone: decodedToken.phone_number,
          photo_url: decodedToken.picture,
        });
        user = await newUser.save();
      }
      const payload: JWTPayload = {
        user_id:
          decodedToken.provider_id === "anonymous"
            ? new ObjectId()
            : user?.id.toString(),
        role:
          decodedToken.provider_id === "anonymous"
            ? "anonymous"
            : user?.role || "user",
      };

      const jwtToken = jwt.sign(payload, configEnv.JWT_SECRET as string, {
        expiresIn: configEnv.JWT_EXPIRE_IN as string,
      });
      return {
        token: jwtToken,
        data: user,
      };
    } catch (error) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Internal Server Error",
        error.stack
      );
    }
  }

  async getUserById(userId: string) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return {
          id: userId,
          name: "",
          email: "",
          phone: "",
          photo_url: "",
          role: "",
          year: null,
          school: null,
          address: null,
        };
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(userId: string, data: UpdateProfilInput) {
    try {
      const user = await User.findByIdAndUpdate(userId, data, {
        new: true,
      });
      if (!user) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          "User not found",
          "user.service/update",
          true
        );
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Update to get course data from Topic model
  async getUserTopics(userId: string) {
    try {
      // Get all topics with their progress
      const topics = await Topic.find({ deleted_at: null }).sort({
        level: 1,
      });

      // Get user's progress for all topics
      const userProgress = await UserTopicProgress.find({ user_id: userId });

      // Create a map of topic_id to progress for quick lookup
      const progressMap = new Map();
      userProgress.forEach((progress) => {
        progressMap.set(progress.topic_id.toString(), progress);
      });

      // Combine topic data with user progress
      const topicsWithProgress = topics.map((topic) => {
        const progress = progressMap.get(topic.id.toString());

        return {
          id: topic.id,
          title: topic.title,
          description: topic.description,
          progress: progress
            ? {
                status: progress.status,
                started_at: progress.started_at,
                completed_at: progress.completed_at,
                notes: progress.notes,
                rating: progress.rating,
              }
            : {
                status: "not_started",
                started_at: null,
                completed_at: null,
                notes: "",
                rating: null,
              },
        };
      });
      console.log("Get user topic progress successfully");
      return topicsWithProgress;
    } catch (error) {
      throw error;
    }
  }

  async getUserTopicProgressByTopicId(userId: string, topicId: string) {
    try {
      const userProgress = await UserTopicProgress.find({
        user_id: userId,
        topic_id: topicId,
      });

      // Get topic level 2 progress
      const topic = await Topic.findById(topicId);
      if (topic && topic.level === 1) {
        const level2Topics = await Topic.find({
          level: 2,
          parent_id: topicId,
          deleted_at: null,
        });

        const level2Progress = await UserTopicProgress.find({
          user_id: userId,
          topic_id: { $in: level2Topics.map((t) => t._id) },
        });

        return [userProgress, ...level2Progress];
      }

      return userProgress;
    } catch (error) {
      throw error;
    }
  }

  async createUserTopicProgress(
    userId: string,
    topicId: string,
    data: CreateUserTopicProgressInput
  ) {
    try {
      // Check if topic exists
      const topic = await Topic.findById(topicId);
      if (!topic) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          "Topic not found",
          "user.service/createUserTopicProgress"
        );
      }

      // Check if progress already exists
      const existingProgress = await UserTopicProgress.findOne({
        user_id: userId,
        topic_id: topicId,
      });

      let progress;
      if (existingProgress) {
        // Update existing progress
        existingProgress.status = data.status || existingProgress.status;
        existingProgress.started_at =
          data.status === "in_progress"
            ? new Date()
            : existingProgress.started_at;
        existingProgress.completed_at =
          data.status === "completed"
            ? new Date()
            : existingProgress.completed_at;
        existingProgress.notes = data.notes || existingProgress.notes;
        existingProgress.rating = data.rating || existingProgress.rating;
        progress = await existingProgress.save();
      } else {
        // Create new progress
        progress = new UserTopicProgress({
          user_id: userId,
          topic_id: topicId,
          status: data.status || "not_started",
          started_at: data.status === "in_progress" ? new Date() : null,
          completed_at: data.status === "completed" ? new Date() : null,
          notes: data.notes || "",
          rating: data.rating || null,
        });
        await progress.save();
      }

      // If topic is level 1 and status is completed, add skills to user
      if (topic.level === 1 && data.status === "completed" && topic.skills) {
        const user = await User.findById(userId);
        const userOnboarding = await UserOnboarding.findOne({
          user_id: userId,
        });

        if (user) {
          // Initialize skills array if it doesn't exist
          if (!user.skills) {
            user.skills = [];
          }

          topic.skills.forEach(async (skill) => {
            if (
              !user.skills.includes(skill) &&
              !(userOnboarding?.skills_have || []).includes(skill)
            ) {
              user.skills.push(skill);
            }
          });

          await user.save();
        }
      }
      console.log("Create/Update user topic progress successfully");
      return progress;
    } catch (error) {
      throw error;
    }
  }

  async deleteUserTopicProgress(userId: string, topicId: string) {
    try {
      // Check if progress exists
      const progress = await UserTopicProgress.findByIdAndDelete({
        user_id: userId,
        topic_id: topicId,
      });

      if (!progress) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          "Progress for this topic not found",
          "user.service/deleteUserTopicProgress"
        );
      }
      console.log("Remove user topic progress successfully");
      return { message: "Progress deleted successfully" };
    } catch (error) {
      throw error;
    }
  }

  // Add methods for managing skills
  async addOrUpdateSkill(userId: string, skills: string[]) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
      }

      // Initialize skills array if it doesn't exist
      if (!user.skills) {
        user.skills = [];
      }

      const newSkill = skills
        .filter((skill) => !user.skills.includes(new ObjectId(skill)))
        .map((skill) => new ObjectId(skill));

      user.skills = [...user.skills, ...newSkill];

      await user.save();
      console.log("Update skill successfully");
      return user;
    } catch (error) {
      throw error;
    }
  }

  async removeSkill(userId: string, skills: string[]) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
      }

      if (user.skills && user.skills.length > 0) {
        user.skills = user.skills.filter((s) =>
          skills.some((sk) => new ObjectId(sk) === s)
        );
        await user.save();
      }
      console.log("Remove skill user succsesfully");
      return user;
    } catch (error) {
      throw error;
    }
  }

  async createOnboarding(userId: string, body: Partial<UserOnboardingInput>) {
    try {
      const { skills_have, ...rest } = body;

      const skillNames = (skills_have || []).map((s) => s.name.trim());

      const existingSkills = await Skill.find({
        name: { $in: skillNames },
      });

      const existingSkillMap = new Map(
        existingSkills.map((s) => [s.name.trim(), s])
      );

      const newSkillsToCreate = skillNames.filter(
        (name) => !existingSkillMap.has(name)
      );

      const createdSkills = await Skill.insertMany(
        newSkillsToCreate.map((name) => ({ name }))
      );

      const allSkills = [...existingSkills, ...createdSkills];

      const onboarding = new UserOnboarding({
        user_id: userId,
        ...rest,
        skills_have: allSkills.map((skill) => new ObjectId(skill.id)),
      });
      await onboarding.save();
      console.log("userId", userId);
      await User.findByIdAndUpdate(userId, {
        onboarding_completed: true,
      });
      console.log("Onboarding created successfully");

      return {
        message: "Onboarding created successfully",
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new UserService();
