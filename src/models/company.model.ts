import mongoose, { Document, Schema, Types } from "mongoose";
import { applyBaseSchemaOptions } from "src/utils/mongoose-helper";

export interface ICompany extends Document {
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
  average_salary?: number;
  average_it_count?: number;
}

const CompanySchema: Schema<ICompany> = new mongoose.Schema(
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
    average_salary: { type: Number },
    average_it_count: { type: Number },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

applyBaseSchemaOptions(CompanySchema);
const Company = mongoose.model<ICompany>("Company", CompanySchema);

export default Company;
