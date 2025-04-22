import mongoose, { Document, Schema, Types } from "mongoose";
import { ISkill } from "./skill.model";
import { applyBaseSchemaOptions } from "src/utils/mongoose-helper";

export interface IJobPosting extends Document {
  id: Types.ObjectId;
  job_title: string;
  salary_min: number;
  salary_max?: number;
  company_id: Types.ObjectId;
  job_description: string;
  position: Types.ObjectId;
  yof: Types.ObjectId;
  date_posted: Date;
  location: string;

  skills: ISkill[];
}

const JobPostingSchema: Schema<IJobPosting> = new mongoose.Schema(
  {
    job_title: { type: String, required: true },
    salary_min: { type: Number, required: true },
    salary_max: { type: Number },
    company_id: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    job_description: { type: String, required: true },
    position: { type: Schema.Types.ObjectId, required: true },
    yof: { type: Schema.Types.ObjectId, required: true },
    date_posted: { type: Date, default: Date.now },
    location: { type: String, required: true },
    skills: [{ type: Schema.Types.ObjectId, ref: "Skill" }],
  },
  {
    collection: "job_postings",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

applyBaseSchemaOptions(JobPostingSchema);
const JobPosting = mongoose.model<IJobPosting>("JobPosting", JobPostingSchema);

export default JobPosting;
