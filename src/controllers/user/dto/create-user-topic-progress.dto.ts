import { UserTopicStatus } from "src/models/user-topic-progress.model";
import { z } from "zod";

export const CreateUserTopicProgressDto = z.object({
  status: z.nativeEnum(UserTopicStatus).optional(),
  notes: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
});

export type CreateUserTopicProgressInput = z.infer<
  typeof CreateUserTopicProgressDto
>;
