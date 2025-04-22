import { z } from "zod";

export const JobPostingsQueryDto = z.object({
  date_from: z
    .string()
    .transform((val) => new Date(val))
    .refine((val) => !isNaN(val.getTime()), {
      message: "Invalid date format",
    })
    .optional(),
  date_to: z
    .string()
    .transform((val) => new Date(val))
    .refine((val) => !isNaN(val.getTime()), {
      message: "Invalid date format",
    })
    .optional(),
  region: z.enum(["north", "central", "south"]).optional(),
});

export type JobPostingsQueryInput = z.infer<typeof JobPostingsQueryDto>;
