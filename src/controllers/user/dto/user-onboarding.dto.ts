import { z } from "zod";

const skillSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const UserOnboardingDto = z.object({
  full_name: z.string(),
  date_of_birth: z
    .string()
    .transform((val) => new Date(val))
    .refine((val) => !isNaN(val.getTime()), {
      message: "Ngày sinh không hợp lệ",
    }),
  gender: z.enum(["male", "female", "other"]).nullable(),
  education_level: z.string().nullable(),
  major: z.string().nullable(),
  school: z.string().nullable(),
  current_goal: z.string().nullable(),
  skills_have: z.array(skillSchema).nullable(),
  experience: z
    .array(
      z.object({
        job_title: z.string(),
        field: z.string(),
        years: z.number(),
      })
    )
    .optional(),
});

export type UserOnboardingInput = z.infer<typeof UserOnboardingDto>;
