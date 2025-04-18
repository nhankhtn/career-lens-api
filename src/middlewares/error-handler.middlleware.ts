import { Response, NextFunction, ErrorRequestHandler } from "express";
import { ApiError, StatusCodes } from "../utils/api-error";
import configEnv from "../config/env";
import { CustomRequest } from "../common/types";
import { IErrorLog } from "../models/error-log.model";
import loggerService from "src/services/logger.service";

export const errorHandler: ErrorRequestHandler = (
  err: Error | ApiError,
  req: CustomRequest,
  res: Response,
  _: NextFunction
): void => {
  if (configEnv.NODE_ENV === "development") {
    console.error("Error:", err);
  }
  const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  const errorLog = {
    method: req.method,
    url: req.originalUrl || req.url,
    params: req.params,
    body: req.body,
    headers: req.headers,
    client_ip: Array.isArray(clientIp) ? clientIp[0] : clientIp,
    duration: 0,
    user_id: req["user"]?.user_id || "",
  } as Omit<IErrorLog, "_id" | "created_at">;

  loggerService.logError(errorLog);

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
    return;
  }

  // Handle other types of errors
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: "error",
    message: "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
