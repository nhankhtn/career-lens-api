import { Response, Request, NextFunction } from "express";
import userService from "../../services/user.service";
import { StatusCodes } from "../../utils/api-error";
import { CustomRequest } from "../../common/types";

class UserController {
  async apiStatus(req: Request, res: Response, next: NextFunction) {
    try {
      res.json({
        status: "OK",
        message: "API is running",
      });
      return;
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await userService.getUserByIdToken(process.env.TOKEN || "");
      res.status(StatusCodes.OK).json(data);
      return;
    } catch (error) {
      throw error;
    }
  }

  async getInfo(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      const data = await userService.getUserById(user?.user_id!);
      return res.json(data);
    } catch (error) {
      throw error;
    }
  }
}

export default new UserController();
