import express from "express";
import userController from "../controllers/user/user.controller";
import { CustomRequest } from "src/common/types";

const router = express.Router();

router.get("/api-status", userController.apiStatus);
router.get("/login", userController.login);
router.get("/info", (req, res, next) => {
  userController.getInfo(req as CustomRequest, res, next);
});

export default router;
