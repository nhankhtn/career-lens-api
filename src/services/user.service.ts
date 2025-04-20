import { firebaseAdmin } from "../config/firebase";
import User, { ICourse } from "../models/user.model";
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

  async addOrUpdateCourse(userId: string, course: {
    id?: string;
    title: string;
    description: string;
    icon?: string;
    progress?: number;
  }): Promise<ProfileResponse> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
      }

      // Initialize courses array if needed
      if (!user.courses) {
        user.courses = [];
      }

      if (course.id) {
        // Update existing course
        const courseIndex = user.courses.findIndex(c => c.id === course.id);
        if (courseIndex !== -1) {
          user.courses[courseIndex] = {
            ...user.courses[courseIndex],
            ...course
          };
        } else {
          throw new ApiError(StatusCodes.NOT_FOUND, "Course not found");
        }
      } else {
        // Add new course
        const newCourse: ICourse = {
          id: new mongoose.Types.ObjectId().toString(),
          title: course.title,
          description: course.description,
          icon: course.icon,
          progress: course.progress || 0
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
}

export default new UserService();
