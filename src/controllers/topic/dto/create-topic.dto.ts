import { TopicType } from "src/models/topic.model";
import { z } from "zod";

export const ResourceDto = z.object({
  title: z.string().nullable(),
  type: z.nativeEnum(TopicType),
  url: z.string().nullable(),
});

export const CreateTopicDto = z.object({
  title: z.string().min(1, "Title is required"),
  level: z.number().min(1, "Level is required"),
  priority: z.number().min(1, "Priority is required"),
  parent_id: z.string().nullable(),
  description: z.string().nullable(),
  resources: z.array(ResourceDto).optional(),
});

export type CreateTopicInput = z.infer<typeof CreateTopicDto>;
