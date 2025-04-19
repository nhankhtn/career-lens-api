import mongoose, { Document, Schema, Types } from "mongoose";

export interface IExperienceLevel extends Document {
  id: Types.ObjectId;
  title: string;
  yof_min: number;
  yof_max?: number;
}

const ExperienceLevelSchema: Schema<IExperienceLevel> = new mongoose.Schema(
  {
    title: { type: String, required: true },
    yof_min: { type: Number, required: true },
    yof_max: { type: Number },
  },
  {
    collection: "experience_levels",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
ExperienceLevelSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});
ExperienceLevelSchema.set("toObject", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});
const ExperienceLevel = mongoose.model<IExperienceLevel>(
  "ExperienceLevel",
  ExperienceLevelSchema
);

export default ExperienceLevel;
