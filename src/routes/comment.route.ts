import express from "express";
import { validate } from "src/middlewares/validator.middleware";
import commentController from "src/controllers/forum/comment/comment.controller";
import { CreateCommentDto } from "src/controllers/forum/comment/dto/create-comment.dto";
import { UpdateCommentDto } from "src/controllers/forum/comment/dto/update-comment.dto";
import { CommentQueryDto } from "src/controllers/forum/comment/dto/comment-query.dto";
import { jwtAuthMiddleware } from "src/middlewares/jwt-auth.middleware";
import { z } from "zod";

const router = express.Router();

// Public route
router.get("/api-status", commentController.apiStatus);

// Protected routes (require authentication)
router.post(
  "/",
  jwtAuthMiddleware,
  validate(
    z.object({
      body: CreateCommentDto.extend({
        post_id: z.string(), // Yêu cầu post_id trong body
      }),
    })
  ),
  commentController.create
);

router.get(
  "/",
  jwtAuthMiddleware,
  validate(
    z.object({
      query: CommentQueryDto,
    })
  ),
  commentController.findAll
);

router.get(
  "/:id",
  jwtAuthMiddleware,
  validate(
    z.object({
      params: z.object({
        id: z.string(),
      }),
    })
  ),
  commentController.findById
);

router.patch(
  "/:id",
  jwtAuthMiddleware,
  validate(
    z.object({
      body: UpdateCommentDto,
      params: z.object({
        id: z.string(),
      }),
    })
  ),
  commentController.update
);

router.delete(
  "/:id",
  jwtAuthMiddleware,
  validate(
    z.object({
      params: z.object({
        id: z.string(),
      }),
    })
  ),
  commentController.remove
);

export default router;