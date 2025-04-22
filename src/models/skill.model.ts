import mongoose, { Document, Schema, Types } from "mongoose";
import { applyBaseSchemaOptions } from "src/utils/mongoose-helper";

export interface ISkill extends Document {
  id: Types.ObjectId;
  name: string;
}

const SkillSchema: Schema<ISkill> = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

applyBaseSchemaOptions(SkillSchema);
const Skill = mongoose.model<ISkill>("Skill", SkillSchema);
export default Skill;
