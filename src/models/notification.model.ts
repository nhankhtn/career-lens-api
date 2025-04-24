import mongoose, { Document, Schema, Types } from "mongoose";
import { IUser } from "./user.model";
import { IForumPost } from "./forum-post.model";
import { IComment } from "./comment.model";

export enum NotificationType {
  NEW_POST = "NEW_POST",
  NEW_COMMENT = "NEW_COMMENT",
  NEW_LIKE = "NEW_LIKE",
  NEW_FOLLOW = "NEW_FOLLOW",
}

export interface INotification extends Document {
  user_id: IUser["id"]; // Người nhận thông báo
  sender_id: IUser["id"]; // Người gửi thông báo (người thực hiện hành động)
  post_id?: IForumPost["id"]; // Bài viết liên quan (nếu có)
  comment_id?: IComment["id"]; // Bình luận liên quan (nếu có)
  type: NotificationType; // Loại thông báo
  message: string; // Nội dung thông báo
  read: boolean; // Trạng thái đã đọc
  created_at: Date;
  updated_at: Date;
}

const NotificationSchema: Schema<INotification> = new mongoose.Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sender_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    post_id: { type: Schema.Types.ObjectId, ref: "ForumPost" },
    comment_id: { type: Schema.Types.ObjectId, ref: "Comment" },
    type: { type: String, enum: Object.values(NotificationType), required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

NotificationSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (_, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});

const Notification = mongoose.model<INotification>("Notification", NotificationSchema);
export default Notification;