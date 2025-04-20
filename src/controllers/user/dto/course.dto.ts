import { z } from "zod";

export const CourseDto = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Course title is required"),
  description: z.string().min(1, "Course description is required"),
  icon: z.string().optional(),
  progress: z.number().min(0).max(100).optional().default(0),
}); 