import express from "express";
import { z } from "zod";
import userController from "../controllers/user/user.controller";
import { CustomRequest } from "../common/types";
import { validate } from "../middlewares/validator.middleware";
import { LoginDto } from "../controllers/user/dto/login-user.dto";
import { UpdateProfileDto } from "../controllers/user/dto/update-profile.dto";
import { CourseDto } from "../controllers/user/dto/course.dto";
import { jwtAuthMiddleware } from "../middlewares/jwt-auth.middleware";

// Create DTOs for the new endpoints
const SkillDto = z.object({
  name: z.string(),
  rating: z.number().min(1).max(5),
  category: z.string().optional(),
});

const CertificationDto = z.object({
  name: z.string(),
  organization: z.string(),
  year: z.number().optional(),
  score: z.string().optional(),
});

const CourseProgressDto = z.object({
  progress: z.number().min(0).max(100),
});

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

// Course/Topic routes
router.get(
  "/courses/recommended",
  (req, res, next) => userController.getRecommendedCourses(req, res, next)
);

router.get(
  "/profile/courses",
  jwtAuthMiddleware,
  (req, res, next) => userController.getFollowedCourses(req as CustomRequest, res, next)
);

router.post(
  "/profile/courses/:courseId", 
  jwtAuthMiddleware,
  validate(z.object({
    params: z.object({
      courseId: z.string(),
    }),
  })),
  (req, res, next) => userController.followCourse(req as CustomRequest, res, next)
);

router.put(
  "/profile/courses/:courseId/progress",
  jwtAuthMiddleware,
  validate(z.object({
    params: z.object({
      courseId: z.string(),
    }),
    body: CourseProgressDto,
  })),
  (req, res, next) => userController.updateCourseProgress(req as CustomRequest, res, next)
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

// Skills routes
router.post(
  "/profile/skills",
  jwtAuthMiddleware,
  validate(z.object({
    body: SkillDto,
  })),
  (req, res, next) => userController.addOrUpdateSkill(req as CustomRequest, res, next)
);

router.delete(
  "/profile/skills/:skillName",
  jwtAuthMiddleware,
  validate(z.object({
    params: z.object({
      skillName: z.string(),
    }),
  })),
  (req, res, next) => userController.removeSkill(req as CustomRequest, res, next)
);

// Certification routes
router.post(
  "/profile/certifications",
  jwtAuthMiddleware,
  validate(z.object({
    body: CertificationDto,
  })),
  (req, res, next) => userController.addOrUpdateCertification(req as CustomRequest, res, next)
);

router.delete(
  "/profile/certifications/:certId",
  jwtAuthMiddleware,
  validate(z.object({
    params: z.object({
      certId: z.string(),
    }),
  })),
  (req, res, next) => userController.removeCertification(req as CustomRequest, res, next)
);

export default router;
