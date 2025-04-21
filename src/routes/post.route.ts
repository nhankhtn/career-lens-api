import express from "express";
import { GeneralQueryDto } from "src/common/types";
import { validate } from "src/middlewares/validator.middleware";
import postController from "src/controllers/forum/post/post.controller";
import { CreatePostDto } from "src/controllers/forum/post/dto/create-post.dto";
import { UpdatePostDto } from "src/controllers/forum/post/dto/update-post.dto";
import { PostQueryDto } from "src/controllers/forum/post/dto/post-query.dto";
import { z } from "zod";

const router = express.Router();

// Public route
router.get("/api-status", postController.apiStatus);

// Protected routes (require authentication)
router.post(
  "/",
  validate(
    z.object({
      body: CreatePostDto,
    })
  ),
  postController.create
);

router.get(
  "/",
  validate(
    z.object({
      query: PostQueryDto,
    })
  ),
  postController.findAll
);

router.get(
  "/saved",
  validate(
    z.object({
      query: PostQueryDto,
    })
  ),
  postController.getSavedPosts
);

router.get(
  "/followed",
  validate(
    z.object({
      query: PostQueryDto,
    })
  ),
  postController.getFollowedPosts
);

router.get(
  "/:id",
  validate(
    z.object({
      params: z.object({
        id: z.string(),
      }),
    })
  ),
  postController.findById
);

router.patch(
  "/:id",
  validate(
    z.object({
      body: UpdatePostDto,
      params: z.object({
        id: z.string(),
      }),
    })
  ),
  postController.update
);

router.delete(
  "/:id",
  validate(
    z.object({
      params: z.object({
        id: z.string(),
      }),
    })
  ),
  postController.remove
);

router.post(
  "/:id/like",
  validate(
    z.object({
      params: z.object({
        id: z.string(),
      }),
    })
  ),
  postController.likePost
);

router.post(
  "/:id/unlike",
  validate(
    z.object({
      params: z.object({
        id: z.string(),
      }),
    })
  ),
  postController.unlikePost
);

router.post(
  "/:id/save",
  validate(
    z.object({
      params: z.object({
        id: z.string(),
      }),
    })
  ),
  postController.savePost
);

router.post(
  "/:id/unsave",
  validate(
    z.object({
      params: z.object({
        id: z.string(),
      }),
    })
  ),
  postController.unsavePost
);

export default router;