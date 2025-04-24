import Comment from "src/models/comment.model";
import ForumPost from "src/models/forum-post.model";
import { CommentQueryInput } from "src/controllers/forum/comment/dto/comment-query.dto";
import { CreateCommentInput } from "src/controllers/forum/comment/dto/create-comment.dto";
import { UpdateCommentInput } from "src/controllers/forum/comment/dto/update-comment.dto";
import { ApiError, StatusCodes } from "src/utils/api-error";
import notificationService from "./notification.service"; // Đã bỏ comment import
import { io } from "src/server"; // Import Socket.IO để gửi thông báo realtime
import User from "src/models/user.model"; // Import User để lấy thông tin người dùng
import { NotificationType } from "src/models/notification.model"; // Import NotificationType
import mongoose from "mongoose";

class CommentService {
  async create(data: CreateCommentInput & { user_id: string; post_id: string }) {
    const post = await ForumPost.findById(data.post_id);
    if (!post || post.deleted_at) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Post not found");
    }

    const comment = await Comment.create({
      user_id: data.user_id,
      post_id: data.post_id,
      content: data.content,
      image_url: data.image_url || [],
    });

    // Cập nhật comment_count trong ForumPost
    await ForumPost.findByIdAndUpdate(data.post_id, { $inc: { comment_count: 1 } });

    // Populate dữ liệu để gửi thông báo realtime
    const populatedComment = await Comment.findById(comment._id).populate(
      "user_id",
      "name photo_url company location"
    );

    // Gửi thông báo realtime đến tất cả người dùng đang xem bài viết này
    io.to(data.post_id).emit("newComment", populatedComment);

    // Gửi thông báo cho người đăng bài (nếu không phải là người tạo bình luận)
    if ((post.user_id as mongoose.Types.ObjectId).toString() !== data.user_id) {
      const sender = await User.findById(data.user_id).select("name");
      await notificationService.create({
        user_id: (post.user_id as mongoose.Types.ObjectId).toString(),
        sender_id: data.user_id,
        post_id: (post._id as mongoose.Types.ObjectId).toString(),
        comment_id: (comment._id as mongoose.Types.ObjectId).toString(),
        type: NotificationType.NEW_COMMENT,
        message: `${sender.name} đã bình luận bài viết của bạn: "${data.content.slice(0, 50)}..."`,
      });
    }

    return populatedComment;
  }

  async findAll(query: CommentQueryInput) {
    const { offset, limit, key, post_id } = query;
    const filter: any = { deleted_at: null };
    if (key) {
      filter.content = { $regex: key, $options: "i" };
    }
    if (post_id) {
      filter.post_id = post_id;
    }

    const [comments, total] = await Promise.all([
      Comment.find(filter)
        .populate("user_id", "name photo_url company location")
        .skip(offset)
        .limit(limit)
        .sort({ created_at: -1 }),
      Comment.countDocuments(filter),
    ]);

    return { data: comments, total };
  }

  async findById(id: string) {
    const comment = await Comment.findById(id).populate(
      "user_id",
      "name photo_url company location"
    );
    if (!comment || comment.deleted_at) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Comment not found");
    }
    return comment;
  }

  async update(id: string, data: UpdateCommentInput, userId: string) {
    const comment = await Comment.findById(id);
    if (!comment || comment.deleted_at) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Comment not found");
    }
    if (comment.user_id.toString() !== userId) {
      throw new ApiError(StatusCodes.FORBIDDEN, "You are not authorized to update this comment");
    }
    const updatedComment = await Comment.findByIdAndUpdate(id, data, { new: true }).populate(
      "user_id",
      "name photo_url company location"
    );
    return updatedComment;
  }

  async remove(id: string, userId: string) {
    const comment = await Comment.findById(id);
    if (!comment || comment.deleted_at) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Comment not found");
    }
    if (comment.user_id.toString() !== userId) {
      throw new ApiError(StatusCodes.FORBIDDEN, "You are not authorized to delete this comment");
    }
    await Comment.findByIdAndUpdate(id, { deleted_at: new Date(), deleted_by: userId });

    // Cập nhật comment_count trong ForumPost
    await ForumPost.findByIdAndUpdate(comment.post_id, { $inc: { comment_count: -1 } });

    return { message: "Comment deleted successfully" };
  }
}

export default new CommentService();