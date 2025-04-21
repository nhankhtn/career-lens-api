import { z } from "zod";

export const UpdateUserSkillDto = z.object({
  skills: z.array(z.string()),
});

export type UpdateUserSkillInput = z.infer<typeof UpdateUserSkillDto>;
