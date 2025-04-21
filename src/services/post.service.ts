import ForumPost from "src/models/forum-post.model";
import { PostLike, PostSave } from "src/models/forum-post.model";
import { PostQueryInput } from "src/controllers/forum/post/dto/post-query.dto";
import { CreatePostInput } from "src/controllers/forum/post/dto/create-post.dto";
import { UpdatePostInput } from "src/controllers/forum/post/dto/update-post.dto";
import { ApiError, StatusCodes } from "src/utils/api-error";
import Connection from "src/models/connection.model";
import mongoose from "mongoose";
import { io } from "src/server"; // Import Socket.IO để gửi thông báo realtime
import notificationService from "./notification.service"; // Import NotificationService
import { NotificationType } from "src/models/notification.model"; // Import NotificationType
import User from "src/models/user.model"; // Import User để lấy thông tin người dùng

class PostService {
  async create(data: CreatePostInput & { user_id: string }) {
    const post = await ForumPost.create({
      user_id: data.user_id,
      content: data.content,
      image_url: data.image_url || [],
      like_count: 0,
      comment_count: 0,
    });

    // Populate dữ liệu để gửi thông báo
    const populatedPost = await ForumPost.findById(post._id).populate(
      "user_id",
      "name photo_url company location"
    );

    // Tìm những người follow người đăng bài
    const followers = await Connection.find({ target_user_id: data.user_id }).select("user_id");
    const followerIds = followers.map((follower) => follower.user_id.toString());

    // Gửi thông báo realtime đến tất cả người follow
    io.to(followerIds).emit("newPost", populatedPost);

    // Tạo thông báo cho từng người follow
    for (const followerId of followerIds) {
      await notificationService.create({
        user_id: followerId,
        sender_id: data.user_id,
        post_id: (post._id as mongoose.Types.ObjectId).toString(),
        type: NotificationType.NEW_POST,
        message: `${populatedPost.user_id.name} vừa đăng một bài viết mới`,
      });
    }

    return post;
  }

  async findAll(query: PostQueryInput) {
    const { offset, limit, key, user_id } = query;
    const filter: any = { deleted_at: null };
    if (key) {
      filter.content = { $regex: key, $options: "i" };
    }
    if (user_id) {
      filter.user_id = user_id;
    }

    const [posts, total] = await Promise.all([
      ForumPost.find(filter)
        .populate("user_id", "name photo_url company location")
        .populate({
          path: "comments",
          match: { deleted_at: null },
          populate: { path: "user_id", select: "name photo_url company location" },
        })
        .skip(offset)
        .limit(limit)
        .sort({ created_at: -1 }),
      ForumPost.countDocuments(filter),
    ]);

    return { data: posts, total };
  }

  async findById(id: string) {
    const post = await ForumPost.findById(id)
      .populate("user_id", "name photo_url company location")
      .populate({
        path: "comments",
        match: { deleted_at: null },
        populate: { path: "user_id", select: "name photo_url company location" },
      });
    if (!post || post.deleted_at) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Post not found");
    }
    return post;
  }

  async update(id: string, data: UpdatePostInput, userId: string) {
    const post = await ForumPost.findById(id);
    if (!post || post.deleted_at) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Post not found");
    }
    if ((post.user_id as mongoose.Types.ObjectId).toString() !== userId) {
      throw new ApiError(StatusCodes.FORBIDDEN, "You are not authorized to update this post");
    }
    const updatedPost = await ForumPost.findByIdAndUpdate(id, data, { new: true })
      .populate("user_id", "name photo_url company location")
      .populate({
        path: "comments",
        match: { deleted_at: null },
        populate: { path: "user_id", select: "name photo_url company location" },
      });
    return updatedPost;
  }

  async remove(id: string, userId: string) {
    const post = await ForumPost.findById(id);
    if (!post || post.deleted_at) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Post not found");
    }
    if ((post.user_id as mongoose.Types.ObjectId).toString() !== userId) {
      throw new ApiError(StatusCodes.FORBIDDEN, "You are not authorized to delete this post");
    }
    await ForumPost.findByIdAndUpdate(id, { deleted_at: new Date(), deleted_by: userId });
    return { message: "Post deleted successfully" };
  }

  async getSavedPosts(userId: string, query: PostQueryInput) {
    const { offset, limit, key } = query;
    const filter: any = { user_id: userId };
    if (key) {
      filter.content = { $regex: key, $options: "i" };
    }

    const savedPosts = await PostSave.find(filter)
      .populate({
        path: "post_id",
        match: { deleted_at: null },
        populate: [
          { path: "user_id", select: "name photo_url company location" },
          {
            path: "comments",
            match: { deleted_at: null },
            populate: { path: "user_id", select: "name photo_url company location" },
          },
        ],
      })
      .skip(offset)
      .limit(limit)
      .sort({ created_at: -1 });

    const total = await PostSave.countDocuments(filter);
    const posts = savedPosts.filter((save) => save.post_id).map((save) => save.post_id);

    return { data: posts, total };
  }

  async getFollowedPosts(userId: string, query: PostQueryInput) {
    const { offset, limit, key } = query;

    const connections = await Connection.find({
      user_id: userId,
    }).select("target_user_id");

    const followedUserIds = connections.map((conn) => conn.target_user_id);

    const filter: any = { user_id: { $in: followedUserIds }, deleted_at: null };
    if (key) {
      filter.content = { $regex: key, $options: "i" };
    }

    const [posts, total] = await Promise.all([
      ForumPost.find(filter)
        .populate("user_id", "name photo_url company location")
        .populate({
          path: "comments",
          match: { deleted_at: null },
          populate: { path: "user_id", select: "name photo_url company location" },
        })
        .skip(offset)
        .limit(limit)
        .sort({ created_at: -1 }),
      ForumPost.countDocuments(filter),
    ]);

    return { data: posts, total };
  }

  async likePost(postId: string, userId: string) {
    const post = await ForumPost.findById(postId);
    if (!post || post.deleted_at) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Post not found");
    }

    const existingLike = await PostLike.findOne({ user_id: userId, post_id: postId });
    if (existingLike) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "You already liked this post");
    }

    await PostLike.create({ user_id: userId, post_id: postId });
    await ForumPost.findByIdAndUpdate(postId, { $inc: { like_count: 1 } });

    // Gửi thông báo realtime đến tất cả người dùng đang xem bài viết
    io.to(postId).emit("postLiked", { postId, like_count: post.like_count + 1 });

    // Gửi thông báo cho tác giả bài viết (nếu không phải là người thích)
    if ((post.user_id as mongoose.Types.ObjectId).toString() !== userId) {
      const sender = await User.findById(userId).select("name");
      await notificationService.create({
        user_id: (post.user_id as mongoose.Types.ObjectId).toString(),
        sender_id: userId,
        post_id: postId,
        type: NotificationType.NEW_LIKE,
        message: `${sender.name} đã thích bài viết của bạn`,
      });
    }

    return { message: "Post liked successfully" };
  }

  async unlikePost(postId: string, userId: string) {
    const post = await ForumPost.findById(postId);
    if (!post || post.deleted_at) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Post not found");
    }

    const result = await PostLike.deleteOne({ user_id: userId, post_id: postId });
    if (result.deletedCount === 0) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "You have not liked this post");
    }

    await ForumPost.findByIdAndUpdate(postId, { $inc: { like_count: -1 } });

    // Gửi thông báo realtime đến tất cả người dùng đang xem bài viết
    io.to(postId).emit("postUnliked", { postId, like_count: post.like_count - 1 });

    return { message: "Post unliked successfully" };
  }

  async savePost(postId: string, userId: string) {
    const post = await ForumPost.findById(postId);
    if (!post || post.deleted_at) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Post not found");
    }

    const existingSave = await PostSave.findOne({ user_id: userId, post_id: postId });
    if (existingSave) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "You already saved this post");
    }

    await PostSave.create({ user_id: userId, post_id: postId });

    return { message: "Post saved successfully" };
  }

  async unsavePost(postId: string, userId: string) {
    const post = await ForumPost.findById(postId);
    if (!post || post.deleted_at) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Post not found");
    }

    const result = await PostSave.deleteOne({ user_id: userId, post_id: postId });
    if (result.deletedCount === 0) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "You have not saved this post");
    }

    return { message: "Post unsaved successfully" };
  }
}

export default new PostService();