import { GeneralQueryDto } from "src/common/types";
import { z } from "zod";

export const CareerQueryDto = GeneralQueryDto.extend({
  skill: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) => (typeof val === "string" ? [val] : val)),

  min_salary: z
    .string()
    .optional()
    .transform((val) => parseInt(val || "0"))
    .refine((val) => !isNaN(val), {
      message: "min_salary must be a number",
    }),

  max_salary: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(parseInt(val)), {
      message: "max_salary must be a valid number or undefined",
    })
    .transform((val) => (val ? parseInt(val) : undefined)),

  major: z.string().optional(),
  // experience_level: z.string().optional(),
});
export type CareerQueryInput = z.infer<typeof CareerQueryDto>;
