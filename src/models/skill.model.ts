import mongoose, { Document, Schema, Types } from "mongoose";

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
SkillSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (_, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});
SkillSchema.set("toObject", {
  virtuals: true,
  versionKey: false,
  transform: function (_, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});
const Skill = mongoose.model<ISkill>("Skill", SkillSchema);
export default Skill;
