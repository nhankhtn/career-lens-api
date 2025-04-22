import express from "express";
import skillController from "src/controllers/skill/skill.controller";

const router = express.Router();

router.get("/", skillController.getSkills);

export default router;
