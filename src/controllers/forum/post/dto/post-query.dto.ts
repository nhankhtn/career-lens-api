import { GeneralQueryDto } from "src/common/types";
import { z } from "zod";

export const PostQueryDto = GeneralQueryDto.extend({
  user_id: z.string().optional(),
});

export type PostQueryInput = z.infer<typeof PostQueryDto>;