import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "src/utils/api-error";
import { CustomRequest } from "src/common/types";
import commentService from "src/services/comment.service";
import { CommentQueryDto } from "./dto/comment-query.dto";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";

class CommentController {
  async apiStatus(_: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.json({
        status: "OK",
        message: "API is running",
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user;
      if (!user) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }
      const commentData = CreateCommentDto.parse(req.body);
      const postId = req.body.post_id;
      if (!postId) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "post_id is required" });
        return;
      }
      const comment = await commentService.create({
        ...commentData,
        user_id: user.user_id,
        post_id: postId,
      });
      res.status(StatusCodes.CREATED).json(comment);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = CommentQueryDto.parse(req.query);
      const result = await commentService.findAll(query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const comment = await commentService.findById(req.params.id);
      res.json(comment);
    } catch (error) {
      next(error);
    }
  }

  async update(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user;
      if (!user) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }
      const commentData = UpdateCommentDto.parse(req.body);
      const comment = await commentService.update(req.params.id, commentData, user.user_id);
      res.json(comment);
    } catch (error) {
      next(error);
    }
  }

  async remove(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user;
      if (!user) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }
      const result = await commentService.remove(req.params.id, user.user_id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new CommentController();