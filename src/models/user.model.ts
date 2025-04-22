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
  company?: string;
  location?: string;
  position?: string;
  created_at: Date;
  updated_at: Date;
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // Đảm bảo email là bắt buộc
    password: { type: String },
    phone: { type: String },
    photo_url: { type: String },
    role: { type: String, required: true, default: 'user' },
    company: { type: String },
    location: { type: String },
    position: { type: String },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc: Document, ret: any) {
    // Kiểm tra ret có tồn tại và là object không
    if (!ret || typeof ret !== 'object') return {};

    // Xử lý an toàn cho các trường
    ret.id = ret._id ? ret._id.toString() : null;
    ret.name = ret.name ? String(ret.name) : null;
    ret.email = ret.email ? String(ret.email) : null;
    ret.phone = ret.phone ? String(ret.phone) : null;
    ret.photo_url = ret.photo_url ? String(ret.photo_url) : null;
    ret.role = ret.role ? String(ret.role) : 'user';
    ret.company = ret.company ? String(ret.company) : null;
    ret.location = ret.location ? String(ret.location) : null;
    ret.position = ret.position ? String(ret.position) : null;
    ret.created_at = ret.created_at ? ret.created_at.toISOString() : null;
    ret.updated_at = ret.updated_at ? ret.updated_at.toISOString() : null;

    // Xóa các trường không cần thiết
    delete ret._id;
    delete ret.__v;
    delete ret.password; // Không trả về mật khẩu

    return ret;
  },
});

UserSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: function (doc: Document, ret: any) {
    // Kiểm tra ret có tồn tại và là object không
    if (!ret || typeof ret !== 'object') return {};

    // Xử lý an toàn cho các trường
    ret.id = ret._id ? ret._id.toString() : null;
    ret.name = ret.name ? String(ret.name) : null;
    ret.email = ret.email ? String(ret.email) : null;
    ret.phone = ret.phone ? String(ret.phone) : null;
    ret.photo_url = ret.photo_url ? String(ret.photo_url) : null;
    ret.role = ret.role ? String(ret.role) : 'user';
    ret.company = ret.company ? String(ret.company) : null;
    ret.location = ret.location ? String(ret.location) : null;
    ret.position = ret.position ? String(ret.position) : null;
    ret.created_at = ret.created_at ? ret.created_at.toISOString() : null;
    ret.updated_at = ret.updated_at ? ret.updated_at.toISOString() : null;

    // Xóa các trường không cần thiết
    delete ret._id;
    delete ret.__v;
    delete ret.password; // Không trả về mật khẩu

    return ret;
  },
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;