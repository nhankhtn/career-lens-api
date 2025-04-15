import { z } from "zod";

export const LoginDto = z.object({
  body: z.object({
    id_token: z.string().min(1, "id_token is required"),
  }),
});
