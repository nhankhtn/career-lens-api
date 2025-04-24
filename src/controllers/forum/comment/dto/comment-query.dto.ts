import { GeneralQueryDto } from "src/common/types";
import { z } from "zod";

export const CommentQueryDto = GeneralQueryDto.extend({
  post_id: z.string().optional(),
});

export type CommentQueryInput = z.infer<typeof CommentQueryDto>;