import { Express, Router } from "express";

import userRouter from "./user.route";
import topicRouter from "./topic.route";
import careerRouter from "./career.route";
import jobPostingsRouter from "./job-postings.route";
import { jwtAuthMiddleware } from "src/middlewares/jwt-auth.middleware";

function route(app: Express) {
  const apiRouter = Router();
  apiRouter.use("/users", userRouter);
  apiRouter.use("/topics", jwtAuthMiddleware, topicRouter);
  apiRouter.use("/careers", jwtAuthMiddleware, careerRouter);
  apiRouter.use("/job-postings", jwtAuthMiddleware, jobPostingsRouter);

  app.use("/api/v1", apiRouter);
}

export default route;
