import mongoose, { Document, Schema, Types } from "mongoose";
import { applyBaseSchemaOptions } from "src/utils/mongoose-helper";

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

applyBaseSchemaOptions(ExperienceLevelSchema);
const ExperienceLevel = mongoose.model<IExperienceLevel>(
  "ExperienceLevel",
  ExperienceLevelSchema
);

export default ExperienceLevel;
