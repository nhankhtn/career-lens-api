import express from "express";
import { validate } from "src/middlewares/validator.middleware";
import notificationController from "src/controllers/forum/notification/notification.controller";
import { jwtAuthMiddleware } from "src/middlewares/jwt-auth.middleware";
import { z } from "zod";

const router = express.Router();

// Lấy danh sách thông báo
router.get(
  "/",
  jwtAuthMiddleware,
  validate(
    z.object({
      query: z.object({
        offset: z
          .string()
          .optional()
          .transform((val) => parseInt(val || "0")),
        limit: z
          .string()
          .optional()
          .transform((val) => parseInt(val || "10")),
      }),
    })
  ),
  notificationController.findAll
);

// Đánh dấu thông báo đã đọc
router.patch(
  "/:id/read",
  jwtAuthMiddleware,
  validate(
    z.object({
      params: z.object({
        id: z.string(),
      }),
    })
  ),
  notificationController.markAsRead
);

// Đánh dấu tất cả thông báo đã đọc
router.patch("/read-all", jwtAuthMiddleware, notificationController.markAllAsRead);

export default router;