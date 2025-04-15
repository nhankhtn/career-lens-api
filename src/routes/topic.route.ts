import express from "express";
import { GeneralQueryDto } from "src/common/types";
import { validate } from "src/middlewares/validator.middleware";
import topicController from "src/controllers/topic/topic.controller";
import { CreateTopicDto } from "src/controllers/topic/dto/create-topic.dto";
import { UpdateTopicDto } from "src/controllers/topic/dto/update-topic.dto";
import { z } from "zod";

const router = express.Router();

router.get("/api-status", topicController.apiStatus);
router.post(
  "/",
  validate(
    z.object({
      body: CreateTopicDto,
    })
  ),
  topicController.create
);
router.get(
  "/",
  validate(
    z.object({
      query: GeneralQueryDto,
    })
  ),
  topicController.findAll
);
router.put(
  "/:id",
  validate(
    z.object({
      body: UpdateTopicDto,
      params: z.object({
        id: z.string(),
      }),
    })
  ),
  topicController.update
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
  topicController.remove
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
  topicController.findById
);

export default router;
