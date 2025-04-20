import { firebaseAdmin } from "../config/firebase";
import User, { ICourse, ISkill, ICertification } from "../models/user.model";
import Topic, { ITopic, TopicType } from "../models/topic.model";
import jwt from "jsonwebtoken";
import { ApiError, StatusCodes } from "../utils/api-error";
import configEnv from "../config/env";
import { JWTPayload, ProfileResponse } from "../common/types";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";

class UserService {
  async getUserByIdToken(idToken: string) {
    try {
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
      let user = await User.findOne({
        email: decodedToken.email,
      });
      if (!user && decodedToken.provider_id !== "anonymous") {
        const newUser = new User({
          name: decodedToken.name,
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
        role: user?.role || "user",
      };

      const jwtToken = jwt.sign(
        payload, 
        configEnv.JWT_SECRET as string, 
        { expiresIn: configEnv.JWT_EXPIRE_IN as string }
      );
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
          password: "",
          photo_url: "",
          role: "user",
          created_at: new Date(),
          updated_at: new Date(),
        };
      }
      return user;
    } catch (error) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Internal Server Error",
        error.stack
      );
    }
  }

  // Profile methods from user-profile.service.ts
  async getProfileByUserId(userId: string): Promise<ProfileResponse> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
      }

      // If analytics doesn't exist, initialize it
      if (!user.analytics) {
        user.analytics = {
          weeklyViews: { w1: 0, w2: 0, w3: 0, w4: 0 },
          totalViews: 0,
          totalStars: 0,
          totalSearches: 0
        };
        await user.save();
      }

      // Increment profile view
      await this.incrementProfileView(user);

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        photo_url: user.photo_url,
        bio: user.bio,
        address: user.address,
        year: user.year,
        school: user.school,
        quote: user.quote,
        analytics: user.analytics,
        social_media: user.social_media,
        skills: user.skills || [],
        certifications: user.certifications || [],
        courses: user.courses || []
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Error getting user profile",
        error.stack
      );
    }
  }

  async incrementProfileView(user: any): Promise<void> {
    // Update the current week's view count and total
    const currentWeek = new Date().getDay() % 4 + 1;
    const weekKey = `w${currentWeek}` as keyof typeof user.analytics.weeklyViews;
    
    user.analytics.weeklyViews[weekKey]++;
    user.analytics.totalViews++;
    
    await user.save();
  }

  async updateProfile(userId: string, profileData: Partial<ProfileResponse>): Promise<ProfileResponse> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
      }

      // Initialize analytics if it doesn't exist
      if (!user.analytics) {
        user.analytics = {
          weeklyViews: { w1: 0, w2: 0, w3: 0, w4: 0 },
          totalViews: 0,
          totalStars: 0,
          totalSearches: 0
        };
      }

      // Update user data with any fields provided
      if (profileData.name !== undefined) user.name = profileData.name;
      if (profileData.phone !== undefined) user.phone = profileData.phone;
      if (profileData.photo_url !== undefined) user.photo_url = profileData.photo_url;
      if (profileData.bio !== undefined) user.bio = profileData.bio;
      if (profileData.address !== undefined) user.address = profileData.address;
      if (profileData.year !== undefined) user.year = profileData.year;
      if (profileData.school !== undefined) user.school = profileData.school;
      if (profileData.quote !== undefined) user.quote = profileData.quote;
      if (profileData.social_media !== undefined) user.social_media = profileData.social_media;
      
      await user.save();

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        photo_url: user.photo_url,
        bio: user.bio,
        address: user.address,
        year: user.year,
        school: user.school,
        quote: user.quote,
        analytics: user.analytics,
        social_media: user.social_media,
        skills: user.skills || [],
        certifications: user.certifications || [],
        courses: user.courses || []
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Error updating user profile",
        error.stack
      );
    }
  }

  async addStar(userId: string): Promise<{totalStars: number}> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
      }

      // Initialize analytics if needed
      if (!user.analytics) {
        user.analytics = {
          weeklyViews: { w1: 0, w2: 0, w3: 0, w4: 0 },
          totalViews: 0,
          totalStars: 0,
          totalSearches: 0
        };
      }

      user.analytics.totalStars += 1;
      await user.save();

      return { totalStars: user.analytics.totalStars };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Error adding star to profile",
        error.stack
      );
    }
  }

  async incrementSearch(userId: string): Promise<{totalSearches: number}> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
      }

      // Initialize analytics if needed
      if (!user.analytics) {
        user.analytics = {
          weeklyViews: { w1: 0, w2: 0, w3: 0, w4: 0 },
          totalViews: 0,
          totalStars: 0,
          totalSearches: 0
        };
      }

      user.analytics.totalSearches += 1;
      await user.save();

      return { totalSearches: user.analytics.totalSearches };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Error incrementing search count",
        error.stack
      );
    }
  }

  // Update to get course data from Topic model
  async getUserCourses(userId: string): Promise<ICourse[]> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
      }

      if (!user.courses || user.courses.length === 0) {
        return [];
      }

      // Get full topic data for each course the user is following
      const courseIds = user.courses.map(course => course.id);
      const topicData = await Topic.find({
        _id: { $in: courseIds.map(id => new mongoose.Types.ObjectId(id)) },
        deleted_at: null
      });

      // Merge topic data with user course progress
      return user.courses.map(userCourse => {
        const topicInfo = topicData.find(t => t._id.toString() === userCourse.id);
        if (topicInfo) {
          return {
            id: userCourse.id,
            title: topicInfo.title,
            description: topicInfo.description || "",
            icon: userCourse.icon,
            progress: userCourse.progress
          };
        }
        return userCourse;
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Error getting user courses",
        error.stack
      );
    }
  }

  // Update to use Topic model when adding a new course
  async addOrUpdateCourse(userId: string, courseId: string): Promise<ProfileResponse> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
      }

      // Find the topic/course in the database
      const topic = await Topic.findOne({ 
        _id: new mongoose.Types.ObjectId(courseId),
        deleted_at: null
      });
      
      if (!topic) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Topic/Course not found");
      }

      // Initialize courses array if needed
      if (!user.courses) {
        user.courses = [];
      }

      // Check if user is already following this course
      const existingCourseIndex = user.courses.findIndex(c => c.id === courseId);
      
      if (existingCourseIndex >= 0) {
        // User is already following this course, just update the progress
        user.courses[existingCourseIndex].title = topic.title;
        user.courses[existingCourseIndex].description = topic.description || "";
      } else {
        // Add new course
        const newCourse: ICourse = {
          id: courseId,
          title: topic.title,
          description: topic.description || "",
          icon: topic.resources && topic.resources.length > 0 ? topic.resources[0].url || "" : "",
          progress: 0
        };
        user.courses.push(newCourse);
      }

      await user.save();

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        photo_url: user.photo_url,
        bio: user.bio,
        address: user.address,
        year: user.year,
        school: user.school,
        quote: user.quote,
        analytics: user.analytics || {
          weeklyViews: { w1: 0, w2: 0, w3: 0, w4: 0 },
          totalViews: 0,
          totalStars: 0,
          totalSearches: 0
        },
        social_media: user.social_media,
        skills: user.skills || [],
        certifications: user.certifications || [],
        courses: user.courses
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Error adding or updating course",
        error.stack
      );
    }
  }

  // Add method to update course progress
  async updateCourseProgress(userId: string, courseId: string, progress: number): Promise<ICourse> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
      }

      if (!user.courses) {
        throw new ApiError(StatusCodes.NOT_FOUND, "No courses found");
      }

      const courseIndex = user.courses.findIndex(c => c.id === courseId);
      if (courseIndex === -1) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Course not found");
      }

      // Ensure progress is between 0 and 100
      user.courses[courseIndex].progress = Math.min(Math.max(progress, 0), 100);
      await user.save();

      return user.courses[courseIndex];
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Error updating course progress",
        error.stack
      );
    }
  }

  async removeCourse(userId: string, courseId: string): Promise<ProfileResponse> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
      }

      if (!user.courses) {
        throw new ApiError(StatusCodes.NOT_FOUND, "No courses found");
      }

      const courseIndex = user.courses.findIndex(c => c.id === courseId);
      if (courseIndex === -1) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Course not found");
      }

      user.courses.splice(courseIndex, 1);
      await user.save();

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        photo_url: user.photo_url,
        bio: user.bio,
        address: user.address,
        year: user.year,
        school: user.school,
        quote: user.quote,
        analytics: user.analytics || {
          weeklyViews: { w1: 0, w2: 0, w3: 0, w4: 0 },
          totalViews: 0,
          totalStars: 0,
          totalSearches: 0
        },
        social_media: user.social_media,
        skills: user.skills || [],
        certifications: user.certifications || [],
        courses: user.courses
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Error removing course",
        error.stack
      );
    }
  }

  async getProfileAnalytics(userId: string): Promise<{
    weeklyViews: { w1: number; w2: number; w3: number; w4: number };
    totalViews: number;
    totalStars: number;
    totalSearches: number;
  }> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
      }

      if (!user.analytics) {
        return {
          weeklyViews: { w1: 0, w2: 0, w3: 0, w4: 0 },
          totalViews: 0,
          totalStars: 0,
          totalSearches: 0
        };
      }

      return user.analytics;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Error getting profile analytics",
        error.stack
      );
    }
  }

  // Add methods for managing skills
  async addOrUpdateSkill(userId: string, skill: ISkill): Promise<ProfileResponse> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
      }

      // Initialize skills array if it doesn't exist
      if (!user.skills) {
        user.skills = [];
      }

      // Check if the skill already exists (by name)
      const existingSkillIndex = user.skills.findIndex(s => s.name === skill.name);
      
      if (existingSkillIndex >= 0) {
        // Update existing skill
        user.skills[existingSkillIndex] = skill;
      } else {
        // Add new skill
        user.skills.push(skill);
      }
      
      await user.save();
      
      return await this.getProfileByUserId(userId);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Error adding/updating skill",
        error.stack
      );
    }
  }

  async removeSkill(userId: string, skillName: string): Promise<ProfileResponse> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
      }

      if (user.skills && user.skills.length > 0) {
        user.skills = user.skills.filter(s => s.name !== skillName);
        await user.save();
      }
      
      return await this.getProfileByUserId(userId);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Error removing skill",
        error.stack
      );
    }
  }

  // Add methods for managing certifications
  async addOrUpdateCertification(userId: string, certification: ICertification): Promise<ProfileResponse> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
      }

      // Initialize certifications array if it doesn't exist
      if (!user.certifications) {
        user.certifications = [];
      }

      // Check if the certification already exists (by name and organization)
      const existingCertIndex = user.certifications.findIndex(
        c => c.name === certification.name && c.organization === certification.organization
      );
      
      if (existingCertIndex >= 0) {
        // Update existing certification
        user.certifications[existingCertIndex] = certification;
      } else {
        // Add new certification
        user.certifications.push(certification);
      }
      
      await user.save();
      
      return await this.getProfileByUserId(userId);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Error adding/updating certification",
        error.stack
      );
    }
  }

  async removeCertification(userId: string, certId: string): Promise<ProfileResponse> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
      }

      if (user.certifications && user.certifications.length > 0) {
        // Since certifications don't have an ID in the model, we'll create a compound ID
        user.certifications = user.certifications.filter(cert => 
          `${cert.name}-${cert.organization}` !== certId
        );
        await user.save();
      }
      
      return await this.getProfileByUserId(userId);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Error removing certification",
        error.stack
      );
    }
  }

  // Get latest topic/courses for recommendation
  async getRecommendedCourses(): Promise<any[]> {
    try {
      // Get top-level topics (courses)
      const topics = await Topic.find({ 
        level: 1, 
        deleted_at: null 
      })
      .sort({ createdAt: -1 })
      .limit(5);
      
      return topics.map(topic => ({
        id: topic._id.toString(),
        title: topic.title,
        description: topic.description || "",
        icon: topic.resources && topic.resources.length > 0 ? topic.resources[0].url || "" : "",
      }));
    } catch (error) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Error getting recommended courses",
        error.stack
      );
    }
  }
}

export default new UserService();
