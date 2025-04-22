import mongoose, { Document, Schema } from "mongoose";
import { Types } from "mongoose";
import { applyBaseSchemaOptions } from "src/utils/mongoose-helper";

export interface IUser extends Document {
  id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  photo_url?: string;
  role: string;
  year?: number;
  school?: string;
  address?: string;
  bio?: string;
  quote?: string;
  social_media?: {
    facebook?: string;
    instagram?: string;
    other?: string;
  };
  created_at: Date;
  updated_at: Date;
  skills: Types.ObjectId[];
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String },
    phone: { type: String },
    photo_url: { type: String },
    role: { type: String, required: true, default: "user" },
    year: { type: Number },
    school: { type: String },
    address: { type: String },
    social_media: {
      facebook: { type: String },
      instagram: { type: String },
      other: { type: String },
    },
    skills: { type: [Types.ObjectId], default: [], ref: "Skill" },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

applyBaseSchemaOptions(UserSchema);

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
