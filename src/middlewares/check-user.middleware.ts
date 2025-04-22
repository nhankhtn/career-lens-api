import { CustomRequest } from "src/common/types";
import { NextFunction, Response } from "express";
import { ErrorMessages, StatusCodes } from "src/utils/api-error";

export const checkUserMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  const user = req.user;
  if (!user || user.role !== "user") {
    res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: ErrorMessages.REQUIRE_LOGIN });
    return;
  }
  next();
};
