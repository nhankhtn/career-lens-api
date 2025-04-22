import express from "express";
import { z } from "zod";
import userController from "../controllers/user/user.controller";
import { CustomRequest } from "../common/types";
import { validate } from "../middlewares/validator.middleware";
import { LoginDto } from "../controllers/user/dto/login-user.dto";
import { jwtAuthMiddleware } from "../middlewares/jwt-auth.middleware";
import { UpdateProfileDto } from "src/controllers/user/dto/update-profile.dto";
import { CreateUserTopicProgressDto } from "src/controllers/user/dto/create-user-topic-progress.dto";
import { UpdateUserSkillDto } from "src/controllers/user/dto/user-skill.dto";
import { UserOnboardingDto } from "src/controllers/user/dto/user-onboarding.dto";

const router = express.Router();

// User authentication routes
router.get("/api-status", userController.apiStatus);
router.post("/login", validate(LoginDto), userController.login);
router.get("/info", jwtAuthMiddleware, (req, res, next) => {
  userController.getInfo(req as CustomRequest, res, next);
});

router.get("/topics", jwtAuthMiddleware, (req, res, next) => {
  userController.getUserTopics(req as CustomRequest, res, next);
});

router.get("/topics/:topicId/progress", jwtAuthMiddleware, (req, res, next) => {
  userController.getTopicProgressByTopicId(req as CustomRequest, res, next);
});

router.put(
  "/topics/:topicId/progress",
  validate(
    z.object({
      body: CreateUserTopicProgressDto,
    })
  ),
  jwtAuthMiddleware,
  (req, res, next) => {
    userController.createTopicProgress(req as CustomRequest, res, next);
  }
);

router.delete(
  "/topics/:topicId/progress",
  jwtAuthMiddleware,
  (req, res, next) => {
    userController.deleteTopicProgress(req as CustomRequest, res, next);
  }
);

// User profile routes
router.put(
  "/info",
  jwtAuthMiddleware,
  validate(
    z.object({
      body: UpdateProfileDto,
    })
  ),
  (req, res, next) => {
    userController.updateProfile(req as CustomRequest, res, next);
  }
);

// User skills routes
router.put(
  "/skills",
  validate(
    z.object({
      body: UpdateUserSkillDto,
    })
  ),
  jwtAuthMiddleware,
  (req, res, next) => {
    userController.addOrUpdateSkills(req as CustomRequest, res, next);
  }
);
router.delete(
  "/skills",
  validate(
    z.object({
      body: UpdateUserSkillDto,
    })
  ),
  jwtAuthMiddleware,
  (req, res, next) => {
    userController.removeSkills(req as CustomRequest, res, next);
  }
);

router.post(
  "/onboarding",
  jwtAuthMiddleware,
  validate(
    z.object({
      body: UserOnboardingDto,
    })
  ),
  userController.createOnboarding
);

export default router;
