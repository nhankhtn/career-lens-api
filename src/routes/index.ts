import { Express, Router } from "express";

import userRouter from "./user.route";

function route(app: Express) {
  const apiRouter = Router();
  apiRouter.use("/users", userRouter);

  app.use("/api/v1", apiRouter);
}

export default route;
