import express from "express";
import { z } from "zod";
import userController from "../controllers/user/user.controller";
import { CustomRequest } from "../common/types";
import { validate } from "../middlewares/validator.middleware";
import { LoginDto } from "../controllers/user/dto/login-user.dto";
import { UpdateProfileDto } from "../controllers/user/dto/update-profile.dto";
import { CourseDto } from "../controllers/user/dto/course.dto";
import { jwtAuthMiddleware } from "../middlewares/jwt-auth.middleware";

const router = express.Router();

// User authentication routes
router.get("/api-status", userController.apiStatus);
router.post("/login", validate(LoginDto), userController.login);
router.get("/info", jwtAuthMiddleware, (req, res, next) => {
  userController.getInfo(req as CustomRequest, res, next);
});

// Profile routes
router.get(
  "/profile", 
  jwtAuthMiddleware,
  (req, res, next) => userController.getProfile(req as CustomRequest, res, next)
);

router.get(
  "/profile/:userId", 
  validate(z.object({
    params: z.object({
      userId: z.string(),
    }),
  })),
  userController.getProfileById
);

router.get(
  "/profile/analytics/:userId", 
  validate(z.object({
    params: z.object({
      userId: z.string(),
    }),
  })),
  userController.getProfileAnalytics
);

router.put(
  "/profile", 
  jwtAuthMiddleware,
  validate(z.object({
    body: UpdateProfileDto,
  })),
  (req, res, next) => userController.updateProfile(req as CustomRequest, res, next)
);

router.post(
  "/profile/:userId/star", 
  validate(z.object({
    params: z.object({
      userId: z.string(),
    }),
  })),
  userController.addStar
);

router.post(
  "/profile/search", 
  validate(z.object({
    query: z.object({
      userId: z.string(),
    }),
  })),
  userController.incrementSearch
);

router.post(
  "/profile/courses", 
  jwtAuthMiddleware,
  validate(z.object({
    body: CourseDto,
  })),
  (req, res, next) => userController.addOrUpdateCourse(req as CustomRequest, res, next)
);

router.delete(
  "/profile/courses/:courseId", 
  jwtAuthMiddleware,
  validate(z.object({
    params: z.object({
      courseId: z.string(),
    }),
  })),
  (req, res, next) => userController.removeCourse(req as CustomRequest, res, next)
);

export default router;
