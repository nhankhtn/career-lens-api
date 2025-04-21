import { z } from "zod";

export const UpdateProfileDto = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  photo_url: z.string().optional(),
  address: z.string().optional(),
  year: z.number().int().positive().optional(),
  school: z.string().optional(),
  social_media: z
    .object({
      facebook: z.string().optional(),
      instagram: z.string().optional(),
      other: z.string().optional(),
    })
    .optional(),
});

export type UpdateProfilInput = z.infer<typeof UpdateProfileDto>;
