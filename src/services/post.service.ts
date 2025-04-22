import { Types } from "mongoose";
import ForumPost from "src/models/forum-post.model";
import { PostLike, PostSave } from "src/models/forum-post.model";
import { PostQueryInput } from "src/controllers/forum/post/dto/post-query.dto";
import { CreatePostInput } from "src/controllers/forum/post/dto/create-post.dto";
import { UpdatePostInput } from "src/controllers/forum/post/dto/update-post.dto";
import { ApiError, StatusCodes } from "src/utils/api-error";
import Connection from "src/models/connection.model";
import { io } from "src/server";
import notificationService from "./notification.service";
import { NotificationType } from "src/models/notification.model";
import User from "src/models/user.model";

class PostService {
  async create(data: CreatePostInput & { user_id: string }) {
    const user = await User.findById(data.user_id);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    const post = await ForumPost.create({
      user_id: data.user_id,
      content: data.content,
      image_url: data.image_url || [],
      like_count: 0,
      comment_count: 0,
    });

    const populatedPost = await ForumPost.findById(post._id).populate(
      "user_id",
      "name photo_url company location"
    );

    if (!populatedPost) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to populate post");
    }

    if (!populatedPost.user_id) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Post has invalid user_id after population");
    }

    const followers = await Connection.find({ target_user_id: data.user_id }).select("user_id");
    const followerIds = followers.map((follower) => follower.user_id.toString());

    io.to(followerIds).emit("newPost", populatedPost);

    for (const followerId of followerIds) {
      await notificationService.create({
        user_id: followerId,
        sender_id: data.user_id,
        post_id: (post._id as Types.ObjectId).toString(),
        type: NotificationType.NEW_POST,
        message: `${populatedPost.user_id.name || "Unknown"} vừa đăng một bài viết mới`,
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

    const validPosts = posts.filter((post) => post.user_id);

    return { data: validPosts, total };
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

    if (!post.user_id) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Post has invalid user_id");
    }

    return post;
  }

  async update(id: string, data: UpdatePostInput, userId: string) {
    const post = await ForumPost.findById(id);
    if (!post || post.deleted_at) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Post not found");
    }
    if ((post.user_id as Types.ObjectId).toString() !== userId) {
      throw new ApiError(StatusCodes.FORBIDDEN, "You are not authorized to update this post");
    }
    const updatedPost = await ForumPost.findByIdAndUpdate(id, data, { new: true })
      .populate("user_id", "name photo_url company location")
      .populate({
        path: "comments",
        match: { deleted_at: null },
        populate: { path: "user_id", select: "name photo_url company location" },
      });

    if (!updatedPost) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to update post");
    }

    if (!updatedPost.user_id) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Updated post has invalid user_id");
    }

    return updatedPost;
  }

  async remove(id: string, userId: string) {
    const post = await ForumPost.findById(id);
    if (!post || post.deleted_at) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Post not found");
    }
    if ((post.user_id as Types.ObjectId).toString() !== userId) {
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
    const posts = savedPosts
      .filter((save) => save.post_id && save.post_id.user_id)
      .map((save) => save.post_id);

    return { data: posts, total };
  }

  async getFollowedPosts(userId: string, query: PostQueryInput) {
    const { offset, limit, key } = query;

    const connections = await Connection.find({
      user_id: userId,
    }).select("target_user_id");

    const followedUserIds = connections.map((conn) => conn.target_user_id);

    if (!followedUserIds.length) {
      return { data: [], total: 0 };
    }

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

    const validPosts = posts.filter((post) => post.user_id);

    return { data: validPosts, total };
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

    io.to(postId).emit("postLiked", { postId, like_count: post.like_count + 1 });

    if ((post.user_id as Types.ObjectId).toString() !== userId) {
      const sender = await User.findById(userId).select("name");
      if (!sender) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Sender not found");
      }
      await notificationService.create({
        user_id: (post.user_id as Types.ObjectId).toString(),
        sender_id: userId,
        post_id: postId,
        type: NotificationType.NEW_LIKE,
        message: `${sender.name || "Unknown"} đã thích bài viết của bạn`,
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