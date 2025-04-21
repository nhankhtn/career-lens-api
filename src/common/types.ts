import { Request } from "express";
import { z } from "zod";

export interface JWTPayload {
  user_id: string;
  role: string;
}

export type CustomRequest = Request & {
  user?: JWTPayload;
};

export interface ProfileResponse {
  id: string;
  name: string;
  email: string;
  phone?: string;
  photo_url?: string;
  bio?: string;
  address?: string;
  year?: number;
  school?: string;
  quote?: string;
  analytics: {
    weeklyViews: {
      w1: number;
      w2: number;
      w3: number;
      w4: number;
    };
    totalViews: number;
    totalStars: number;
    totalSearches: number;
  };
  social_media?: {
    facebook?: string;
    instagram?: string;
    other?: string;
  };
  skills?: {
    name: string;
    rating: number;
    category?: string;
  }[];
  certifications?: {
    name: string;
    organization: string;
    year?: number;
    score?: string;
  }[];
  courses: {
    id: string;
    title: string;
    description: string;
    icon?: string;
    progress?: number;
  }[];
}

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
