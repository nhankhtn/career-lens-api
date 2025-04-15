import mongoose, { Document, Schema, Types } from 'mongoose';
import { IUser } from './user.model';

export interface IForumPost extends Document {
  id: Types.ObjectId;
  user_id: IUser['_id'];
  content: string;
  image_url: string[];
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  deleted_by?: IUser['_id'];
}

export interface ILike extends Document {
  user_id: IUser['id'];
  post_id: IForumPost['_id'];
  created_at: Date;
}

export interface IShare extends Document {
  user_id: IUser['id'];
  post_id: IForumPost['_id'];
  created_at: Date;
}

const LikeSchema: Schema<ILike> = new mongoose.Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  post_id: { type: Schema.Types.ObjectId, ref: 'ForumPost', required: true },
  created_at: { type: Date, default: Date.now },
});

const ShareSchema: Schema<IShare> = new mongoose.Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  post_id: { type: Schema.Types.ObjectId, ref: 'ForumPost', required: true },
  created_at: { type: Date, default: Date.now },
});

const ForumPostSchema: Schema<IForumPost> = new mongoose.Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    image_url: [{ type: [String], default: [] }],
    deleted_at: { type: Date },
    deleted_by: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);
ForumPostSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});
ForumPostSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});
const ForumPost = mongoose.model<IForumPost>('ForumPost', ForumPostSchema);

export default ForumPost;
