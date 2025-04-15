import mongoose, { Document, Schema } from 'mongoose';
import { Types } from 'mongoose';

export interface IUser extends Document {
  id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  photo_url?: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String },
    phone: { type: String },
    photo_url: { type: String },
    role: { type: String, required: true, default: 'user' },
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
