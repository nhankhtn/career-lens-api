import mongoose, { Document, Schema, Types } from "mongoose";
import { IUser } from "./user.model";

export interface IConnection extends Document {
  user_id: IUser["id"];
  target_user_id: IUser["id"];
  created_at: Date;
}

const ConnectionSchema: Schema<IConnection> = new mongoose.Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  target_user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  created_at: { type: Date, default: Date.now },
});

// Đảm bảo không có bản ghi trùng lặp (một người không thể follow người khác nhiều lần)
ConnectionSchema.index({ user_id: 1, target_user_id: 1 }, { unique: true });

const Connection = mongoose.model<IConnection>("Connection", ConnectionSchema);
export default Connection;