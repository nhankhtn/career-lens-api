import mongoose, { Document, Schema } from 'mongoose';
import { Types } from 'mongoose';

export interface ICourse {
  id: string;
  title: string;
  description: string;
  icon?: string;
  progress?: number;
}

export interface IProfileAnalytics {
  weeklyViews: { w1: number; w2: number; w3: number; w4: number };
  totalViews: number;
  totalStars: number;
  totalSearches: number;
}

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
  courses?: ICourse[];
  analytics?: IProfileAnalytics;
  created_at: Date;
  updated_at: Date;
}

const CourseSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String },
  progress: { type: Number, default: 0 }
});

const ProfileAnalyticsSchema = new mongoose.Schema({
  weeklyViews: {
    w1: { type: Number, default: 0 },
    w2: { type: Number, default: 0 },
    w3: { type: Number, default: 0 },
    w4: { type: Number, default: 0 }
  },
  totalViews: { type: Number, default: 0 },
  totalStars: { type: Number, default: 0 },
  totalSearches: { type: Number, default: 0 }
});

const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String },
    phone: { type: String },
    photo_url: { type: String },
    role: { type: String, required: true, default: 'user' },
    year: { type: Number },
    school: { type: String },
    address: { type: String },
    bio: { type: String },
    quote: { type: String },
    social_media: {
      facebook: { type: String },
      instagram: { type: String },
      other: { type: String }
    },
    courses: [CourseSchema],
    analytics: { type: ProfileAnalyticsSchema, default: () => ({}) }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});

UserSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
