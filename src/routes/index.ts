import { Express, Router } from "express";

import userRouter from "./user.route";
import topicRouter from "./topic.route";
import { jwtAuthMiddleware } from "src/middlewares/jwt-auth.middleware";

function route(app: Express) {
  const apiRouter = Router();
  apiRouter.use("/users", userRouter);
  apiRouter.use("/topics", jwtAuthMiddleware, topicRouter);

  app.use("/api/v1", apiRouter);
}

export default route;
