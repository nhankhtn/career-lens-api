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
  year: number | null;
  school: string | null;
  address: string | null;
  bio: string | null;
  quote: string | null;
  social_media: {
    facebook: string | null;
    instagram: string | null;
    other: string | null;
  };
  created_at: Date;
  updated_at: Date;
  skills: Types.ObjectId[];
  onboarding_completed: boolean;
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String, default: "" },
    phone: { type: String, default: null },
    photo_url: { type: String, default: null },
    role: { type: String, required: true, default: "user" },
    year: { type: Number, default: null },
    school: { type: String, default: null },
    address: { type: String, default: null },
    social_media: {
      facebook: { type: String, default: null },
      instagram: { type: String, default: null },
      other: { type: String, default: null },
    },
    skills: { type: [Types.ObjectId], default: [], ref: "Skill" },
    onboarding_completed: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

applyBaseSchemaOptions(UserSchema);

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
