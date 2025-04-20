import { ResourceDto } from "./create-topic.dto";
import { z } from "zod";

export const UpdateTopicDto = z
  .object({
    title: z.string().optional(),
    level: z.number().optional(),
    parent_id: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    priority: z.number().optional(),
    order: z.number().optional(),
    resources: z.array(ResourceDto).nullable().optional(),
  })
  .refine((data) => !(data.priority != null && data.order != null), {
    message: "Chỉ được có một trong 'order' hoặc 'priority' khác null.",
    path: ["priority"],
  });

export type UpdateTopicInput = z.infer<typeof UpdateTopicDto>;
