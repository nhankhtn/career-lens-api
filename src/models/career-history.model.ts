import mongoose, { Document, Schema, Types } from "mongoose";
import { applyBaseSchemaOptions } from "src/utils/mongoose-helper";

export interface ICareerHistory extends Document {
  id: Types.ObjectId;
  job_title: string;
  status: string;
  prediction_date: Date;
  salary_prediction: {
    min_salary: number;
    max_salary: number;
    avg_salary: number;
    trend: string;
    confidence: number;
  };
  job_postings_prediction: {
    weekly_postings: number;
    trend: string;
    confidence: number;
    top_companies: string[];
  };
}

const CareerHistorySchema: Schema<ICareerHistory> = new mongoose.Schema(
  {
    job_title: { type: String, required: true },
    status: { type: String, required: true },
    prediction_date: { type: Date, required: true },
    salary_prediction: {
      min_salary: { type: Number, required: true },
      max_salary: { type: Number, required: true },
      avg_salary: { type: Number, required: true },
      trend: { type: String, required: true },
      confidence: { type: Number, required: true },
    },
    job_postings_prediction: {
      weekly_postings: { type: Number, required: true },
      trend: { type: String, required: true },
      confidence: { type: Number, required: true },
      top_companies: [{ type: String, required: true }],
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

applyBaseSchemaOptions(CareerHistorySchema);

const CareerHistory = mongoose.model<ICareerHistory>(
  "CareerHistory",
  CareerHistorySchema
);

export default CareerHistory;
