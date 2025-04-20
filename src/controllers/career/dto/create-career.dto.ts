import { z } from "zod";

export const CreateCareerDto = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  average_salary: z.number().min(0, "Average salary must be a positive number"),
  growth_rate: z.number().min(0, "Growth rate must be a positive number"),
  topic_id: z.string().nullable().optional(),
  related_topics: z.array(z.string()).nullable().optional(),
  skills: z.array(z.string()).nullable().optional(),
});

export type CreateCareerInput = z.infer<typeof CreateCareerDto>;
