import mongoose, { Document, Schema, Types } from "mongoose";
import { applyBaseSchemaOptions } from "src/utils/mongoose-helper";

export enum TopicType {
  course = "Course",
  article = "Article",
  video = "Video",
  book = "Book",
  project = "Project",
  interview = "Interview",
  resource = "Resource",
  other = "Other",
}
export interface ITopic extends Document {
  id: Types.ObjectId;
  title: string;
  level: number;
  parent_id: Types.ObjectId | null;
  description: string | null;
  priority: number | null;
  resources:
    | {
        title: string | null;
        type: TopicType;
        url: string | null;
      }[]
    | null;
  order: number | null;
  deleted_at: Date;
  deleted_by: Types.ObjectId | null;
  skills: Types.ObjectId[] | null;
}

const TopicSchema: Schema<ITopic> = new mongoose.Schema(
  {
    title: { type: String, required: true },
    level: { type: Number, required: true },
    parent_id: { type: Types.ObjectId, default: null },
    description: { type: String },
    priority: { type: Number, default: null },
    order: { type: Number, default: null },
    resources: {
      type: [
        {
          title: { type: String, default: null },
          type: {
            type: String,
            enum: Object.values(TopicType),
            default: TopicType.other,
          },
          url: { type: String, default: null },
        },
      ],
      default: null,
    },
    deleted_at: { type: Date, default: null },
    deleted_by: { type: Types.ObjectId, default: null },
    skills: { type: [Types.ObjectId], default: null, ref: "Skill" },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
TopicSchema.pre("validate", function (next) {
  if (this.level >= 2 && !this.priority && !this.order) {
    this.invalidate("priority", "Phải có một trong 'order' hoặc 'priority'.");
  }
  if (this.priority != null && this.order != null) {
    this.invalidate(
      "priority",
      "Chỉ được có một trong 'order' hoặc 'priority' khác null."
    );
  }
  next();
});
// TopicSchema.index({ title: 1, level: 1, parent_id: 1 }, { unique: true });
applyBaseSchemaOptions(TopicSchema);

const Topic = mongoose.model<ITopic>("Topic", TopicSchema);

export default Topic;
