import express from "express";
import skillController from "src/controllers/skill/skill.controller";
import { jwtAuthMiddleware } from "src/middlewares/jwt-auth.middleware";

const router = express.Router();

router.get("/", jwtAuthMiddleware, skillController.getSkills);

export default router;
