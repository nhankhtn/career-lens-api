import mongoose, { Document, Schema, Types } from 'mongoose';
import { IUser } from './user.model';
import { IForumPost } from './forum-post.model';

export interface IComment extends Document {
  id: Types.ObjectId;
  user_id: IUser['id'];
  image_url: string[];
  content: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  deleted_by?: IUser['id'];
  post_id: IForumPost['_id'];
}

const CommentSchema: Schema<IComment> = new mongoose.Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    image_url: [{ type: [String], default: [] }],
    post_id: { type: Schema.Types.ObjectId, ref: 'ForumPost', required: true }, // Thêm trường post_id
    deleted_at: { type: Date },
    deleted_by: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

CommentSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});

CommentSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});

const Comment = mongoose.model<IComment>('Comment', CommentSchema);

export default Comment;