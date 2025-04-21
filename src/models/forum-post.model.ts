import mongoose, { Document, Schema, Types } from "mongoose";
import { IUser } from "./user.model";

export interface IForumPost extends Document {
  id: Types.ObjectId;
  user_id: IUser["_id"];
  content: string;
  image_url: string[];
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  deleted_by?: IUser["_id"];
  like_count: number;
  comment_count: number;
}

export interface ILike extends Document {
  user_id: IUser["id"];
  post_id: IForumPost["_id"];
  created_at: Date;
}

export interface ISave extends Document {
  user_id: IUser["id"];
  post_id: IForumPost["_id"];
  created_at: Date;
}

const LikeSchema: Schema<ILike> = new mongoose.Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  post_id: { type: Schema.Types.ObjectId, ref: "ForumPost", required: true },
  created_at: { type: Date, default: Date.now },
});
const PostLike = mongoose.model<ILike>("Like", LikeSchema);

const SaveSchema: Schema<ISave> = new mongoose.Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  post_id: { type: Schema.Types.ObjectId, ref: "ForumPost", required: true },
  created_at: { type: Date, default: Date.now },
});
const PostSave = mongoose.model<ISave>("Save", SaveSchema);

const ForumPostSchema: Schema<IForumPost> = new mongoose.Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    image_url: [{ type: [String], default: [] }],
    deleted_at: { type: Date },
    deleted_by: { type: Schema.Types.ObjectId, ref: "User" },
    like_count: { type: Number, default: 0 },
    comment_count: { type: Number, default: 0 },
  },
  {
    collection: "forum_posts",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Thêm virtual field để populate comments
ForumPostSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post_id",
});

ForumPostSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (_, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});

ForumPostSchema.set("toObject", {
  virtuals: true,
  versionKey: false,
  transform: function (_, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});

const ForumPost = mongoose.model<IForumPost>("ForumPost", ForumPostSchema);

export { PostLike, PostSave };
export default ForumPost;