import { firebaseAdmin } from "../config/firebase";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import { ApiError, StatusCodes } from "../utils/api-error";
import configEnv from "../config/env";
import { JWTPayload } from "../common/types";

class UserService {
  async getUserByIdToken(idToken: string) {
    try {
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
      let user = await User.findOne({
        email: decodedToken.email,
      });
      if (!user) {
        const newUser = new User({
          name: decodedToken.name,
          email: decodedToken.email,
          phone: decodedToken.phone_number,
          photo_url: decodedToken.picture,
        });
        user = await newUser.save();
      }
      const payload: JWTPayload = {
        user_id: user._id.toString(),
        role: user.role,
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
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
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
}

export default new UserService();
