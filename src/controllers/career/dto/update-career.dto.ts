import { z } from "zod";

export const UpdateCareerDto = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  average_salary: z.number().optional(),
  growth_rate: z.number().optional(),
  topic_id: z.string().nullable().optional(),
  related_topics: z.array(z.string()).nullable().optional(),
  skills: z.array(z.string()).nullable().optional(),
});

export type UpdateCareerInput = z.infer<typeof UpdateCareerDto>;
