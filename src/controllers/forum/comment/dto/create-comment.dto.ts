import { z } from "zod";

export const CreateCommentDto = z.object({
  content: z.string().min(1, "Content is required"),
  image_url: z.array(z.string()).optional().default([]),
});

export type CreateCommentInput = z.infer<typeof CreateCommentDto>;