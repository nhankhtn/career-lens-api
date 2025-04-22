import mongoose, { Schema, Document, Types } from "mongoose";
import { IUser } from "./user.model";
import { applyBaseSchemaOptions } from "src/utils/mongoose-helper";

export interface IUserOnboarding extends Document {
  user_id: IUser["id"];

  full_name: string;
  date_of_birth: Date;
  gender: "male" | "female" | "other" | null;

  education_level: string | null;
  major: string | null;
  school: string | null;

  current_goal: string | null;
  short_term_goal: string | null;
  long_term_goal: string | null;

  skills_have: Types.ObjectId[];

  experience?: {
    job_title: string;
    field: string;
    years: number;
  }[];

  career_orientation_result: string | null;

  created_at: Date;
  updated_at: Date;
}

const UserOnboardingSchema = new Schema<IUserOnboarding>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    full_name: { type: String, required: true },
    date_of_birth: { type: Date },
    gender: { type: String, enum: ["male", "female", "other"] },

    education_level: { type: String },
    major: { type: String },
    school: { type: String },

    current_goal: { type: String },
    short_term_goal: { type: String },
    long_term_goal: { type: String },

    skills_have: [{ type: [Schema.Types.ObjectId], ref: "Skill", default: [] }],

    experience: [
      {
        job_title: String,
        field: String,
        years: Number,
      },
    ],

    career_orientation_result: { type: String },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

applyBaseSchemaOptions(UserOnboardingSchema);

const UserOnboarding = mongoose.model<IUserOnboarding>(
  "UserOnboarding",
  UserOnboardingSchema
);

export default UserOnboarding;
