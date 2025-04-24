import { z } from "zod";

export const CreatePostDto = z.object({
  content: z.string().min(1, "Content is required"),
  image_url: z.array(z.string()).optional().default([]),
});

export type CreatePostInput = z.infer<typeof CreatePostDto>;