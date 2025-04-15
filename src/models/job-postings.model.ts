import mongoose, { Document, Schema, Types } from 'mongoose';
import { ISkill } from './skill.model';

export interface IJobPosting extends Document {
  id: Types.ObjectId;
  job_title: string;
  salary_min: number;
  salary_max?: number;
  campany_id: string;
  job_description: string;
  date_posted: Date;

  skills: ISkill[];
}

const JobPostingSchema: Schema<IJobPosting> = new mongoose.Schema(
  {
    job_title: { type: String, required: true },
    salary_min: { type: Number, required: true },
    salary_max: { type: Number },
    campany_id: { type: String, required: true },
    job_description: { type: String, required: true },
    date_posted: { type: Date, default: Date.now },
    skills: [{ type: Schema.Types.ObjectId, ref: 'Skill' }],
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);
JobPostingSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});
JobPostingSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});
const JobPosting = mongoose.model<IJobPosting>('JobPosting', JobPostingSchema);

export default JobPosting;
