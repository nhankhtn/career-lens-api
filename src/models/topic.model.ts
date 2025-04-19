import mongoose, { Document, Schema, Types } from "mongoose";

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
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
TopicSchema.pre("validate", function (next) {
  if (this.priority != null && this.order != null) {
    this.invalidate(
      "priority",
      "Chỉ được có một trong 'order' hoặc 'priority' khác null."
    );
  }
  next();
});
TopicSchema.index({ title: 1, level: 1 }, { unique: true });
TopicSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (_, ret) {
    ret.id = ret._id.toString();
    ret.resources.forEach((element: any) => {
      element.id = element._id.toString();
      delete element._id;
    });
    delete ret._id;
  },
});
TopicSchema.set("toObject", {
  virtuals: true,
  versionKey: false,
  transform: function (_, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});
const Topic = mongoose.model<ITopic>("Topic", TopicSchema);

export default Topic;
