import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "src/utils/api-error";
import { CustomRequest } from "src/common/types";
import notificationService from "src/services/notification.service";
import { z } from "zod";

const NotificationQueryDto = z.object({
  offset: z
    .string()
    .optional()
    .transform((val) => parseInt(val || "0"))
    .refine((val) => !isNaN(val), { message: "offset must be a number" }),
  limit: z
    .string()
    .optional()
    .transform((val) => parseInt(val || "10"))
    .refine((val) => !isNaN(val), { message: "limit must be a number" }),
});

class NotificationController {
  async findAll(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user;
      if (!user) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }
      const query = NotificationQueryDto.parse(req.query);
      const result = await notificationService.findAll(user.user_id, query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user;
      if (!user) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }
      const notificationId = req.params.id;
      const result = await notificationService.markAsRead(notificationId, user.user_id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user;
      if (!user) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }
      const result = await notificationService.markAllAsRead(user.user_id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new NotificationController();