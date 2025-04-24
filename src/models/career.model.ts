import mongoose, { Document, Schema, Types } from "mongoose";
import { applyBaseSchemaOptions } from "src/utils/mongoose-helper";

export interface ICareer extends Document {
  id: Types.ObjectId;
  name: string;
  description: string;
  average_salary: number; //
  growth_rate: number; //

  topic_id: Types.ObjectId | null;
  related_topics: Types.ObjectId[] | null;

  min_experience_years: number; // in years

  skills: Types.ObjectId[];
}

const CareerSchema: Schema<ICareer> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    average_salary: { type: Number, required: true },
    growth_rate: { type: Number, required: true },
    topic_id: { type: Types.ObjectId, default: null },
    related_topics: { type: [Types.ObjectId], default: null },
    min_experience_years: { type: Number, default: 0, min: 0 },

    skills: [{ type: Types.ObjectId, default: [], ref: "Skill" }],
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
applyBaseSchemaOptions(CareerSchema);
const Career = mongoose.model<ICareer>("Career", CareerSchema);

export default Career;
