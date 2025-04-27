import "src/models";
import { RootFilterQuery, Types } from "mongoose";
import { CareerQueryInput } from "src/controllers/career/dto/career-query.dto";
import { CreateCareerInput } from "src/controllers/career/dto/create-career.dto";
import { UpdateCareerInput } from "src/controllers/career/dto/update-career.dto";
import { ApiError, StatusCodes } from "src/utils/api-error";

// Import models in the correct order
import Career, { ICareer } from "src/models/career.model"; // Then import Career model
import Topic from "src/models/topic.model";
import UserOnboarding from "src/models/user-onboarding";
import User from "src/models/user.model";
import Skill from "src/models/skill.model";
import { IOpenaiCareer } from "src/common/types";
import openaiService from "./openai.service";
import CareerHistory from "src/models/career-history.model";

class CareerService {
  async create(body: CreateCareerInput) {
    try {
      const career = new Career(body);
      await career.save();
      console.log("Career created successfully");
      return career;
    } catch (error) {
      throw error;
    }
  }

  async findAll(query: CareerQueryInput, userId?: string) {
    try {
      const {
        offset = 0,
        limit = 10,
        key,
        salary_min,
        salary_max,
        experience_min,
        experience_max,
        skills,
        major,
      } = query;
      const filter: RootFilterQuery<ICareer> = {};
      if (key) {
        filter.name = { $regex: key, $options: "i" };
      }
      if (salary_min !== undefined || salary_max !== undefined) {
        filter.average_salary = {};
        if (salary_min !== undefined) filter.average_salary.$gte = salary_min;
        if (salary_max !== undefined) filter.average_salary.$lte = salary_max;
      }
      if (experience_min !== undefined || experience_max !== undefined) {
        filter.min_experience_years = {};
        if (experience_min !== undefined)
          filter.min_experience_years.$gte = experience_min;
        if (experience_max !== undefined)
          filter.min_experience_years.$lte = experience_max;
      }
      if (major) {
        filter.topic_id = major;
      }
      if (skills) {
        filter.skills = { $in: skills };
      }

      let userSkills: Types.ObjectId[] = [];
      if (userId) {
        // Get user's skills from both User and UserOnboarding models
        const [user, userOnboarding] = await Promise.all([
          User.findById(userId).select("skills"),
          UserOnboarding.findOne({ user_id: userId }).select("skills_have"),
        ]);

        // Combine skills from both models
        userSkills = [
          ...(user?.skills || []),
          ...(userOnboarding?.skills_have || []),
        ];
      }
      const careers = await Career.find(filter)
        .populate({
          path: "skills",
          select: "name",
        })
        .populate({
          path: "topic_id",
          select: "title level",
        })
        .skip(offset)
        .limit(limit)
        .sort({ growth_rate: -1 });

      const total = await Career.countDocuments(filter);

      const results = await Promise.all(
        careers.map(async (career) => {
          let level2Count = 0;
          let matchPercentage = 0;

          if (career.topic_id) {
            // Count level 2 topics specifically
            level2Count = await Topic.countDocuments({
              parent_id: career.topic_id._id,
              level: 2,
              deleted_at: null,
            });
          }

          // Calculate skill match percentage
          if (userSkills.length > 0 && career.skills.length > 0) {
            const matchingSkills = career.skills.filter((skill) =>
              userSkills.some(
                (userSkill: Types.ObjectId) =>
                  userSkill.toString() === skill._id.toString()
              )
            );
            matchPercentage =
              (matchingSkills.length / career.skills.length) * 100;
          }

          return {
            ...career.toObject(),
            topic: career.topic_id,
            topic_count: level2Count,
            skill_match_percentage: matchPercentage,
          };
        })
      );

      // Sort results by skill match percentage in descending order
      results.sort(
        (a, b) => b.skill_match_percentage - a.skill_match_percentage
      );

      console.log("Get careers successfully");
      return {
        data: results,
        total: total,
      };
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string, userId: string) {
    try {
      const career = await Career.findById(id)
        .populate({
          path: "skills",
          select: "name",
        })
        .populate({
          path: "topic_id",
          select: "title level parent_id description priority order",
        });

      if (!career) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          "Career not found",
          "career.service/findById",
          true
        );
      }

      // Get level 2 topics for this career's topic
      const level2Topics = await Topic.find({
        parent_id: career.topic_id?._id,
        level: 2,
        deleted_at: null,
      })
        .sort({ order: 1, priority: 1 })
        .select("title level parent_id description priority order")
        .limit(3);

      return {
        ...career.toObject(),
        topics: level2Topics,
      };
    } catch (error) {
      throw error;
    }
  }

  async getCareerFuture(id: string) {
    try {
      const career = await Career.findById(id);
      if (!career) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          "Career not found",
          "career.service/getCareerFuture",
          true
        );
      }

      // Get current date
      const currentDate = new Date();
      const pastDate = new Date();
      pastDate.setMonth(currentDate.getMonth() - 7);
      // Calculate date 30 days from now
      const futureDate = new Date();
      futureDate.setMonth(currentDate.getMonth() + 7);

      // Query career history for the next 30 days
      const history = await CareerHistory.find({
        career_id: id,
        prediction_date: {
          $gte: pastDate,
          $lte: futureDate,
        },
      })
        .select("salary_prediction job_postings_prediction prediction_date")
        .sort({ prediction_date: 1 });

      return history;
    } catch (error) {
      throw error;
    }
  }

  async getCareerDetail(id: string, userId: string) {
    try {
      const career = await Career.findById(id);
      if (!career) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          "Career not found",
          "career.service/getCareerDetail",
          true
        );
      }

      const user = await User.findById(userId);
      if (!user) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          "User not found",
          "career.service/findById",
          true
        );
      }

      const userOnboarding = await UserOnboarding.findOne({ user_id: userId });
      if (!userOnboarding) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          "User onboarding not found",
          "career.service/findById",
          true
        );
      }
      const unionSkillIds = Array.from(
        new Set([...userOnboarding.skills_have, ...user.skills])
      );

      const skills = await Skill.find({
        _id: { $in: unionSkillIds },
      });
      const skillNames = skills.map((skill) => skill.name);

      const query: IOpenaiCareer = {
        skills: skillNames,
        education: userOnboarding.education_level || "",
        experience: userOnboarding.experience?.[0]?.years.toString() || "0",
        target_job: career.name,
      };

      const guidance = await openaiService.generateCareerDescription(query);
      return {
        guidance,
      };
    } catch (error) {
      throw error;
    }
  }

  // Cập nhật thông tin career
  async update(id: string, body: UpdateCareerInput) {
    try {
      const career = await Career.findByIdAndUpdate(id, body, {
        new: true,
      }).populate({
        path: "skills",
        select: "name",
      });
      if (!career) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          "Career not found",
          "career.service/update",
          true
        );
      }
      console.log("Update career successfully");
      return career;
    } catch (error) {
      throw error;
    }
  }

  // Xóa chủ đề
  async remove(id: string, delete_by: string) {
    try {
      const career = await Career.findByIdAndUpdate(
        id,
        { deleted_at: new Date(), deleted_by: delete_by },
        { new: true }
      );
      if (!career) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          "Career not found",
          "career.service/remove",
          true
        );
      }
      console.log("Career deleted successfully");
      return {
        message: "Career deleted successfully",
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new CareerService();
