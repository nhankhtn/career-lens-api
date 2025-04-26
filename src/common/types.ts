import { Request } from "express";
import { z } from "zod";

export interface JWTPayload {
  user_id: string;
  role: string;
}

export type CustomRequest = Request & {
  user?: JWTPayload;
};

export const GeneralQueryDto = z.object({
  offset: z
    .string()
    .optional()
    .transform((val) => parseInt(val || "0"))
    .refine((val) => !isNaN(val), {
      message: "offset must be a number",
    }),
  limit: z
    .string()
    .optional()
    .transform((val) => parseInt(val || "10"))
    .refine((val) => !isNaN(val), {
      message: "offset must be a number",
    }),
  key: z.string().optional(),
});

export type GeneralQueryProps = z.infer<typeof GeneralQueryDto>;

export interface IOpenaiCareer {
  skills: string[];
  education: string;
  experience: string;
  target_job: string;
}
export interface IOpenaiCareerGuidance {
  status: string;
  guidance: string;
  message: string | null;
  relevant_jobs_count: number;
}
