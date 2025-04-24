import { z } from "zod";

export const UpdateCommentDto = z.object({
  content: z.string().optional(),
  image_url: z.array(z.string()).optional(),
});

export type UpdateCommentInput = z.infer<typeof UpdateCommentDto>;