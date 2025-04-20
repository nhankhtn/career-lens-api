import express from "express";
import { validate } from "src/middlewares/validator.middleware";
import { z } from "zod";
import careerController from "src/controllers/career/career.controller";
import { CreateCareerDto } from "src/controllers/career/dto/create-career.dto";
import { CareerQueryDto } from "src/controllers/career/dto/career-query.dto";
import { UpdateCareerDto } from "src/controllers/career/dto/update-career.dto";

const router = express.Router();

router.get("/api-status", careerController.apiStatus);
router.post(
  "/",
  validate(
    z.object({
      body: CreateCareerDto,
    })
  ),
  careerController.create
);
router.get(
  "/",
  validate(
    z.object({
      query: CareerQueryDto,
    })
  ),
  careerController.findAll
);
router.put(
  "/:id",
  validate(
    z.object({
      body: UpdateCareerDto,
      params: z.object({
        id: z.string(),
      }),
    })
  ),
  careerController.update
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
  careerController.remove
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
  careerController.findById
);

export default router;
