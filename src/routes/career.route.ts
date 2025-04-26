import express from "express";
import { validate } from "src/middlewares/validator.middleware";
import { z } from "zod";
import careerController from "src/controllers/career/career.controller";
import { CreateCareerDto } from "src/controllers/career/dto/create-career.dto";
import { CareerQueryDto } from "src/controllers/career/dto/career-query.dto";
import { UpdateCareerDto } from "src/controllers/career/dto/update-career.dto";
import { jwtAuthMiddleware } from "src/middlewares/jwt-auth.middleware";
import { checkAdminMiddleware } from "src/middlewares/check-admin.middleware";
import { checkUserMiddleware } from "src/middlewares/check-user.middleware";
const router = express.Router();

router.get("/api-status", careerController.apiStatus);

// Career Routes
router.post(
  "/",
  validate(
    z.object({
      body: CreateCareerDto,
    })
  ),
  jwtAuthMiddleware,
  checkAdminMiddleware,
  careerController.create
);
router.get(
  "/",
  validate(
    z.object({
      query: CareerQueryDto,
    })
  ),
  jwtAuthMiddleware,
  // checkUserMiddleware,
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
  jwtAuthMiddleware,
  checkAdminMiddleware,
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
  jwtAuthMiddleware,
  checkAdminMiddleware,
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
  jwtAuthMiddleware,
  checkUserMiddleware,
  careerController.findById
);

router.get(
  "/:id/future",
  validate(
    z.object({
      params: z.object({
        id: z.string(),
      }),
    })
  ),
  jwtAuthMiddleware,
  careerController.getCareerFuture
);

router.get(
  "/:id/detail",
  validate(
    z.object({
      params: z.object({
        id: z.string(),
      }),
    })
  ),
  jwtAuthMiddleware,
  checkUserMiddleware,
  careerController.getCareerDetail
);

export default router;
