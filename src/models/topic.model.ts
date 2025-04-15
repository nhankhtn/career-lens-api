import mongoose, { Document, Schema, Types } from 'mongoose';

export enum TopicType {
  course = 'Course',
  article = 'Article',
  video = 'Video',
  book = 'Book',
  project = 'Project',
  interview = 'Interview',
  resource = 'Resource',
  other = 'Other',
}
export interface ITopic extends Document {
  id: Types.ObjectId;
  title: string;
  level: number;
  parent_id: Types.ObjectId | null;
  description: string | null;
  priority: number;
  resources:
    | {
        title: string | null;
        type: TopicType;
        url: string | null;
      }[]
    | null;
}

const TopicSchema: Schema<ITopic> = new mongoose.Schema(
  {
    title: { type: String, required: true },
    level: { type: Number, required: true },
    parent_id: { type: Types.ObjectId, default: null },
    description: { type: String },
    priority: { type: Number, default: 1 },
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
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);
TopicSchema.index({ title: 1, level: 1 }, { unique: true });
TopicSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    ret.resources.forEach((element) => {
      element.id = element._id.toString();
      delete element._id;
    });
    delete ret._id;
  },
});
TopicSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});
const Topic = mongoose.model<ITopic>('Topic', TopicSchema);

export default Topic;
