import { Express, Router } from "express";

import userRouter from "./user.route";
import topicRouter from "./topic.route";
import careerRouter from "./career.route";
import jobPostingsRouter from "./job-postings.route";
import skillRouter from "./skill.route";
import commentRouter from "./comment.route";
import postRouter from "./post.route";
import connectionRouter from "./connection.route";
import notificationRouter from "./notification.route";
import { jwtAuthMiddleware } from "src/middlewares/jwt-auth.middleware";

function route(app: Express) {
  const apiRouter = Router();
  apiRouter.use("/users", userRouter);
  apiRouter.use("/topics", jwtAuthMiddleware, topicRouter);
  apiRouter.use("/careers", jwtAuthMiddleware, careerRouter);
  apiRouter.use("/job-postings", jwtAuthMiddleware, jobPostingsRouter);
  apiRouter.use("/skills", jwtAuthMiddleware, skillRouter);
  apiRouter.use("/comments", jwtAuthMiddleware, commentRouter);
  apiRouter.use("/posts", jwtAuthMiddleware, postRouter);
  apiRouter.use("/connections", jwtAuthMiddleware, connectionRouter);
  apiRouter.use("/notifications", jwtAuthMiddleware, notificationRouter);
  app.use("/api/v1", apiRouter);
}

export default route;
