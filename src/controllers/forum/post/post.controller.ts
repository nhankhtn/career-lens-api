import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "src/utils/api-error";
import { CustomRequest } from "src/common/types";
import postService from "src/services/post.service";
import { PostQueryDto } from "./dto/post-query.dto";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";

class PostController {
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
      const postData = CreatePostDto.parse(req.body);
      const post = await postService.create({
        ...postData,
        user_id: user.user_id,
      });
      res.status(StatusCodes.CREATED).json(post);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = PostQueryDto.parse(req.query);
      const result = await postService.findAll(query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const post = await postService.findById(req.params.id);
      res.json(post);
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
      const postData = UpdatePostDto.parse(req.body);
      const post = await postService.update(req.params.id, postData, user.user_id);
      res.json(post);
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
      const result = await postService.remove(req.params.id, user.user_id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getSavedPosts(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user;
      if (!user) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }
      const query = PostQueryDto.parse(req.query);
      const result = await postService.getSavedPosts(user.user_id, query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // Trong class PostController
async getFollowedPosts(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = req.user;
    if (!user) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
      return;
    }
    const query = PostQueryDto.parse(req.query);
    const result = await postService.getFollowedPosts(user.user_id, query);
    res.json(result);
  } catch (error) {
    next(error);
  }
}
  async likePost(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user;
      if (!user) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }
      const result = await postService.likePost(req.params.id, user.user_id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async unlikePost(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user;
      if (!user) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }
      const result = await postService.unlikePost(req.params.id, user.user_id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async savePost(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user;
      if (!user) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }
      const result = await postService.savePost(req.params.id, user.user_id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async unsavePost(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user;
      if (!user) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }
      const result = await postService.unsavePost(req.params.id, user.user_id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new PostController();