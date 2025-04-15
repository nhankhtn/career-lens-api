import { Request } from "express";

export interface JWTPayload {
  user_id: string;
  role: string;
}

export type CustomRequest = Request & {
  user?: JWTPayload;
};
