import { z } from "zod";

export const UpdatePostDto = z.object({
  content: z.string().optional(),
  image_url: z.array(z.string()).optional(),
});

export type UpdatePostInput = z.infer<typeof UpdatePostDto>;