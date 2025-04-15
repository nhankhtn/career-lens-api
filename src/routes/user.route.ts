import express from "express";
import userController from "../controllers/user/user.controller";
import { CustomRequest } from "src/common/types";
import { validate } from "src/middlewares/validator.middleware";
import { LoginDto } from "src/controllers/user/dto/login-user.dto";
import { jwtAuthMiddleware } from "src/middlewares/jwt-auth.middleware";

const router = express.Router();

router.get("/api-status", userController.apiStatus);
router.post("/login", validate(LoginDto), userController.login);
router.get("/info", jwtAuthMiddleware, (req, res, next) => {
  userController.getInfo(req as CustomRequest, res, next);
});

export default router;
