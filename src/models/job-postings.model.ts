import mongoose, { Document, Schema, Types } from "mongoose";
import { ISkill } from "./skill.model";

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

  skills: ISkill[];
}

const JobPostingSchema: Schema<IJobPosting> = new mongoose.Schema(
  {
    job_title: { type: String, required: true },
    salary_min: { type: Number, required: true },
    salary_max: { type: Number },
    company_id: { type: Schema.Types.ObjectId, required: true },
    job_description: { type: String, required: true },
    position: { type: Schema.Types.ObjectId, required: true },
    yof: { type: Schema.Types.ObjectId, required: true },
    date_posted: { type: Date, default: Date.now },
    skills: [{ type: Schema.Types.ObjectId, ref: "Skill" }],
  },
  {
    collection: "job_postings",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
JobPostingSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (_, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});
JobPostingSchema.set("toObject", {
  virtuals: true,
  versionKey: false,
  transform: function (_, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});
const JobPosting = mongoose.model<IJobPosting>("JobPosting", JobPostingSchema);

export default JobPosting;
