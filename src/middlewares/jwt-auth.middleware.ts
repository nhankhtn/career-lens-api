import { NextFunction, Response } from "express";
import { ErrorMessages, StatusCodes } from "../utils/api-error";
import jwt from "jsonwebtoken";
import configEnv from "../config/env";
import { CustomRequest, JWTPayload } from "src/common/types";
import { Socket } from "socket.io";

export const jwtAuthMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: ErrorMessages.UNAUTHORIZED });
    return;
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, configEnv.JWT_SECRET);
    if (!decoded) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: ErrorMessages.UNAUTHORIZED });
      return;
    }
    req["user"] = decoded as JWTPayload;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Token has expired" });
    } else if (error.name === "JsonWebTokenError") {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid token" });
    } else {
      next(error);
    }
  }
};

// Middleware xác thực cho Socket.IO
export const jwtAuthMiddlewareSocket = (socket: Socket, next: (err?: Error) => void) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

  try {
    const decoded = jwt.verify(token, configEnv.JWT_SECRET) as JWTPayload;
    if (!decoded) {
      return next(new Error("Authentication error: Invalid token"));
    }
    (socket as any).user = decoded; // Gắn user vào socket
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new Error("Authentication error: Token has expired"));
    } else if (error.name === "JsonWebTokenError") {
      return next(new Error("Authentication error: Invalid token"));
    } else {
      return next(error);
    }
  }
};