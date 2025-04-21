import { Request, Response, NextFunction } from "express";
import { StatusCodes, ApiError } from "src/utils/api-error";
import { CustomRequest } from "src/common/types";
import Connection from "src/models/connection.model";
import User from "src/models/user.model";
import notificationService from "src/services/notification.service";
import { NotificationType } from "src/models/notification.model";

class ConnectionController {
  async follow(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user;
      if (!user) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }

      const targetUserId = req.params.targetUserId;
      const userId = user.user_id;

      // Kiểm tra xem targetUserId có tồn tại không
      const targetUser = await User.findById(targetUserId);
      if (!targetUser) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Target user not found");
      }

      // Kiểm tra xem người dùng có đang cố follow chính mình không
      if (userId === targetUserId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "You cannot follow yourself");
      }

      // Kiểm tra xem đã follow chưa
      const existingConnection = await Connection.findOne({
        user_id: userId,
        target_user_id: targetUserId,
      });
      if (existingConnection) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "You are already following this user");
      }

      // Tạo bản ghi follow
      await Connection.create({
        user_id: userId,
        target_user_id: targetUserId,
      });

      // Lấy thông tin người dùng từ database để lấy name
      const sender = await User.findById(userId).select("name");
      if (!sender) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Sender user not found");
      }

      // Tạo thông báo cho người được follow
      await notificationService.create({
        user_id: targetUserId,
        sender_id: userId,
        type: NotificationType.NEW_FOLLOW,
        message: `${sender.name || "Someone"} đã follow bạn`,
      });

      res.json({ message: "Followed successfully" });
    } catch (error) {
      next(error);
    }
  }

  async unfollow(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user;
      if (!user) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }

      const targetUserId = req.params.targetUserId;
      const userId = user.user_id;

      // Kiểm tra xem targetUserId có tồn tại không
      const targetUser = await User.findById(targetUserId);
      if (!targetUser) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Target user not found");
      }

      // Kiểm tra xem có đang follow không
      const connection = await Connection.findOne({
        user_id: userId,
        target_user_id: targetUserId,
      });
      if (!connection) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "You are not following this user");
      }

      // Xóa bản ghi follow
      await Connection.deleteOne({ user_id: userId, target_user_id: targetUserId });

      res.json({ message: "Unfollowed successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export default new ConnectionController();