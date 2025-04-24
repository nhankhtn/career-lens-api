import { GeneralQueryDto } from "src/common/types";
import { z } from "zod";

export const CareerQueryDto = GeneralQueryDto.extend({
  skills: z
    .preprocess((val) => {
      if (typeof val === "string") return val.split(",");
      return val;
    }, z.array(z.string()))
    .optional(),

  salary_min: z
    .string()
    .optional()
    .transform((val) => parseInt(val || "0"))
    .refine((val) => !isNaN(val), {
      message: "salary_min must be a number",
    }),

  salary_max: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(parseInt(val)), {
      message: "salary_max must be a valid number or undefined",
    })
    .transform((val) => (val ? parseInt(val) : undefined)),

  experience_min: z
    .string()
    .optional()
    .transform((val) => parseInt(val || "0"))
    .refine((val) => !isNaN(val), {
      message: "experience_min must be a number",
    }),

  experience_max: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(parseInt(val)), {
      message: "experience_max must be a valid number or undefined",
    })
    .transform((val) => (val ? parseInt(val) : undefined)),

  major: z.string().optional(),
  // experience_level: z.string().optional(),
});
export type CareerQueryInput = z.infer<typeof CareerQueryDto>;
