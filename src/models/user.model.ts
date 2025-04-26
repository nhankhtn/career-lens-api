import mongoose, { Document, Schema } from "mongoose";
import { Types } from "mongoose";
import { applyBaseSchemaOptions } from "src/utils/mongoose-helper";

export interface IUser extends Document {
  id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone: string | null;
  photo_url: string | null;
  role: string;
  created_at: Date;
  updated_at: Date;
  skills: Types.ObjectId[];
  onboarding_completed: boolean;
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String },
    phone: { type: String },
    photo_url: { type: String },
    role: { type: String, required: true, default: "user" },
    skills: { type: [Schema.Types.ObjectId], ref: "Skill", default: [] },
    onboarding_completed: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
applyBaseSchemaOptions(UserSchema);
const User = mongoose.model<IUser>("User", UserSchema);

export default User;
