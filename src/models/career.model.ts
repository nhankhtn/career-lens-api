import mongoose, { Document, Schema, Types } from "mongoose";

export interface ICareer extends Document {
  id: Types.ObjectId;
  name: string;
  description: string;
  average_salary: number; //
  growth_rate: number; // 

  topic_id: Types.ObjectId | null;
  related_topics: Types.ObjectId[] | null;

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
    skills: [{ type: Types.ObjectId, default: [], ref: "Skill" }],
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
CareerSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (_, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});
CareerSchema.set("toObject", {
  virtuals: true,
  versionKey: false,
  transform: function (_, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});
const Career = mongoose.model<ICareer>("Career", CareerSchema);

export default Career;
