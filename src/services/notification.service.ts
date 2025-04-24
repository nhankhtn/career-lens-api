import Notification, { NotificationType } from "src/models/notification.model";
import { ApiError, StatusCodes } from "src/utils/api-error";
import User from "src/models/user.model";
import ForumPost from "src/models/forum-post.model";
import { io } from "src/server"; // Import Socket.IO để gửi thông báo realtime

interface CreateNotificationInput {
  user_id: string; // Người nhận thông báo
  sender_id: string; // Người gửi thông báo
  post_id?: string; // Bài viết liên quan (nếu có)
  comment_id?: string; // Bình luận liên quan (nếu có)
  type: NotificationType; // Loại thông báo
  message: string; // Nội dung thông báo
}

class NotificationService {
  async create(data: CreateNotificationInput) {
    const { user_id, sender_id, post_id, comment_id, type, message } = data;

    // Kiểm tra người nhận và người gửi
    const user = await User.findById(user_id);
    const sender = await User.findById(sender_id);
    if (!user || !sender) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    // Nếu có post_id, kiểm tra bài viết
    if (post_id) {
      const post = await ForumPost.findById(post_id);
      if (!post || post.deleted_at) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Post not found");
      }
    }

    // Tạo thông báo
    const notification = await Notification.create({
      user_id,
      sender_id,
      post_id,
      comment_id,
      type,
      message,
      read: false,
    });

    // Populate dữ liệu để gửi thông báo realtime
    const populatedNotification = await Notification.findById(notification._id)
      .populate("user_id", "name photo_url company location")
      .populate("sender_id", "name photo_url company location")
      .populate("post_id", "content");

    // Gửi thông báo realtime đến người nhận
    io.to(user_id).emit("newNotification", populatedNotification);

    return notification;
  }

  async findAll(userId: string, query: { offset: number; limit: number }) {
    const { offset, limit } = query;

    const [notifications, total] = await Promise.all([
      Notification.find({ user_id: userId })
        .populate("user_id", "name photo_url company location")
        .populate("sender_id", "name photo_url company location")
        .populate("post_id", "content")
        .populate("comment_id", "content")
        .skip(offset)
        .limit(limit)
        .sort({ created_at: -1 }),
      Notification.countDocuments({ user_id: userId }),
    ]);

    return { data: notifications, total };
  }

  async markAsRead(id: string, userId: string) {
    const notification = await Notification.findById(id);
    if (!notification) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Notification not found");
    }
    if (notification.user_id.toString() !== userId) {
      throw new ApiError(StatusCodes.FORBIDDEN, "You are not authorized to update this notification");
    }
    notification.read = true;
    await notification.save();
    return notification;
  }

  async markAllAsRead(userId: string) {
    await Notification.updateMany({ user_id: userId, read: false }, { read: true });
    return { message: "All notifications marked as read" };
  }
}

export default new NotificationService();