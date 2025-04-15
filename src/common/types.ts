import { Request } from "express";
import { z } from "zod";

export interface JWTPayload {
  user_id: string;
  role: string;
}

export type CustomRequest = Request & {
  user?: JWTPayload;
};

export const GeneralQueryDto = z.object({
  offset: z
    .string()
    .optional()
    .transform((val) => parseInt(val || "0"))
    .refine((val) => !isNaN(val), {
      message: "offset must be a number",
    }),
  limit: z
    .string()
    .optional()
    .transform((val) => parseInt(val || "10"))
    .refine((val) => !isNaN(val), {
      message: "offset must be a number",
    }),
  key: z.string().optional(),
});

export type GeneralQueryProps = z.infer<typeof GeneralQueryDto>;
