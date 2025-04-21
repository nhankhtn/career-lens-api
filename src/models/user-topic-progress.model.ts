import mongoose, { Schema, Document } from "mongoose";
import { ITopic } from "./topic.model";
import { IUser } from "./user.model";
import { applyBaseSchemaOptions } from "src/utils/mongoose-helper";

export enum UserTopicStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

export interface IUserTopicProgress extends Document {
  user_id: IUser["id"];
  topic_id: ITopic["id"];

  status: UserTopicStatus;
  started_at?: Date;
  completed_at?: Date;
  notes?: string;
  rating?: number;
}

const UserTopicProgressSchema = new Schema<IUserTopicProgress>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    topic_id: { type: Schema.Types.ObjectId, ref: "Topic", required: true },

    status: {
      type: String,
      enum: Object.values(UserTopicStatus),
      default: UserTopicStatus.NOT_STARTED,
    },
    started_at: { type: Date, default: null },
    completed_at: { type: Date, default: null },
    notes: { type: String, default: "" },
    rating: { type: Number, min: 1, max: 5, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

UserTopicProgressSchema.index({ user_id: 1, topic_id: 1 }, { unique: true });

applyBaseSchemaOptions(UserTopicProgressSchema);

const UserTopicProgress = mongoose.model<IUserTopicProgress>(
  "UserTopicProgress",
  UserTopicProgressSchema
);

export default UserTopicProgress;
