import express from "express";
import { validate } from "src/middlewares/validator.middleware";
import connectionController from "src/controllers/forum/connection/connection.controller";
import { jwtAuthMiddleware } from "src/middlewares/jwt-auth.middleware";
import { z } from "zod";

const router = express.Router();

// Protected routes (require authentication)
router.post(
  "/follow/:targetUserId",
  jwtAuthMiddleware,
  validate(
    z.object({
      params: z.object({
        targetUserId: z.string(),
      }),
    })
  ),
  connectionController.follow
);

router.post(
  "/unfollow/:targetUserId",
  jwtAuthMiddleware,
  validate(
    z.object({
      params: z.object({
        targetUserId: z.string(),
      }),
    })
  ),
  connectionController.unfollow
);

export default router;