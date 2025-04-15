import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ICampany extends Document {
  id: Types.ObjectId;
  name: string;
  website_urls: {
    main?: string;
    careers?: string;
    facebook?: string;
    linkedin?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    youtube?: string;
  };
  industry?: string;
  location?: string[];
  email: {
    main?: string;
    careers?: string;
    support?: string;
  };
  phone?: string;
  photo_url?: string;
  founded_at?: number;
  created_at?: Date;
  updated_at?: Date;
  size?: string;
}

const CampanySchema: Schema<ICampany> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    website_urls: {
      type: {
        main: { type: String },
        careers: { type: String },
        facebook: { type: String },
        linkedin: { type: String },
        instagram: { type: String },
        twitter: { type: String },
        tiktok: { type: String },
        youtube: { type: String },
      },
    },
    industry: { type: String },
    location: { type: [String] },
    email: {
      type: {
        main: { type: String },
        careers: { type: String },
        support: { type: String },
      },
    },
    phone: { type: String },
    photo_url: { type: String },
    founded_at: { type: Number },
    size: { type: String },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);
CampanySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});
CampanySchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});
const Campany = mongoose.model<ICampany>('Campany', CampanySchema);

export default Campany;
