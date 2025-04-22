import { Response, Request, NextFunction } from "express";
import userService from "../../services/user.service";
import { StatusCodes } from "../../utils/api-error";
import { CustomRequest } from "../../common/types";

class UserController {
  /**
   * @swagger
   * /api/v1/users/api-status:
   *   get:
   *     summary: Check API status
   *     description: Returns the current status of the API
   *     tags:
   *       - User
   *     responses:
   *       200:
   *         description: API is running
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: OK
   *                 message:
   *                   type: string
   *                   example: API is running
   */
  async apiStatus(_: Request, res: Response, next: NextFunction) {
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

  /**
   * @swagger
   * /api/v1/users/login:
   *   post:
   *     summary: Login with Firebase ID token
   *     description: Authenticate user using Firebase ID token and return JWT token
   *     tags:
   *       - User
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - id_token
   *             properties:
   *               id_token:
   *                 type: string
   *                 description: Firebase ID token
   *                 example: "eyJhbGciOiJSUzI1NiIsImtpZCI6Ij..."
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 token:
   *                   type: string
   *                   description: JWT token for authentication
   *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   *                 data:
   *                   $ref: '#/components/schemas/User'
   *       400:
   *         description: Bad request
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { id_token } = req.body;
      const data = await userService.getUserByIdToken(id_token);
      res.status(StatusCodes.OK).json(data);
      return;
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/users/info:
   *   get:
   *     summary: Get user information with profile
   *     description: Retrieve the authenticated user's information including profile data
   *     tags:
   *       - User
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User information with profile retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserProfile'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       404:
   *         description: User not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  async getInfo(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      const profileData = await userService.getUserById(user?.user_id!);

      res.json(profileData);
      return;
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/users/info:
   *   put:
   *     summary: Update user profile
   *     description: Update the authenticated user's profile information
   *     tags:
   *       - User
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *               phone:
   *                 type: string
   *               photo_url:
   *                 type: string
   *     responses:
   *       200:
   *         description: Profile updated successfully
   *       404:
   *         description: User not found
   *       500:
   *         description: Internal server error
   */
  async updateProfile(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      const updatedUser = await userService.updateProfile(
        user?.user_id!,
        req.body
      );
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/users/topics:
   *   get:
   *     summary: Get user's topics and progress
   *     description: Retrieve all topics with user's progress
   *     tags:
   *       - User
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Topics retrieved successfully
   *       500:
   *         description: Internal server error
   */
  async getUserTopics(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      const topics = await userService.getUserTopics(user?.user_id!);
      res.json(topics);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/users/topics/{topicId}/progress:
   *   put:
   *     summary: Create user topic progress
   *     description: Create progress for a specific topic
   *     tags:
   *       - User
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: topicId
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               status:
   *                 type: string
   *                 enum: [not_started, in_progress, completed]
   *               notes:
   *                 type: string
   *               rating:
   *                 type: number
   *     responses:
   *       200:
   *         description: Progress created successfully
   *       400:
   *         description: Bad request
   *       404:
   *         description: Topic not found
   *       500:
   *         description: Internal server error
   */
  async createTopicProgress(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = req.user;
      const { topicId } = req.params;
      const progress = await userService.createUserTopicProgress(
        user?.user_id!,
        topicId,
        req.body
      );
      res.json(progress);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/users/topics/{topicId}/progress:
   *   get:
   *     summary: Get user topic progress by topic ID
   *     description: Get progress for a specific topic including level 2 topics if applicable
   *     tags:
   *       - User
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: topicId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Progress retrieved successfully
   *       404:
   *         description: Topic not found
   *       500:
   *         description: Internal server error
   */
  async getTopicProgressByTopicId(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = req.user;
      const { topicId } = req.params;
      const progress = await userService.getUserTopicProgressByTopicId(
        user?.user_id!,
        topicId
      );
      res.json(progress);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/users/topics/{topicId}/progress:
   *   delete:
   *     summary: Delete user topic progress
   *     description: Delete progress for a specific topic
   *     tags:
   *       - User
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: topicId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Progress deleted successfully
   *       404:
   *         description: Progress not found
   *       500:
   *         description: Internal server error
   */
  async deleteTopicProgress(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = req.user;
      const { topicId } = req.params;
      const result = await userService.deleteUserTopicProgress(
        user?.user_id!,
        topicId
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/users/skills:
   *   put:
   *     summary: Add or update user skills
   *     description: Add new skills or update existing ones
   *     tags:
   *       - User
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               skills:
   *                 type: array
   *                 items:
   *                   type: string
   *     responses:
   *       200:
   *         description: Skills updated successfully
   *       404:
   *         description: User not found
   *       500:
   *         description: Internal server error
   */
  async addOrUpdateSkills(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = req.user;
      const { skills } = req.body;
      const updatedUser = await userService.addOrUpdateSkill(
        user?.user_id!,
        skills
      );
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/users/skills:
   *   delete:
   *     summary: Remove user skills
   *     description: Remove specified skills from user profile
   *     tags:
   *       - User
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               skills:
   *                 type: array
   *                 items:
   *                   type: string
   *     responses:
   *       200:
   *         description: Skills removed successfully
   *       404:
   *         description: User not found
   *       500:
   *         description: Internal server error
   */
  async removeSkills(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      const { skills } = req.body;
      const updatedUser = await userService.removeSkill(user?.user_id!, skills);
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/users/onboarding:
   *   post:
   *     summary: Create user onboarding
   *     description: Create onboarding data for a user
   *     tags:
   *       - User
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               skills_have:
   *                 type: array
   *                 items:
   *                   type: string
   *               skills_want:
   *                 type: array
   *                 items:
   *                   type: string
   *               career_goals:
   *                 type: array
   *                 items:
   *                   type: string
   *               learning_preferences:
   *                 type: array
   *                 items:
   *                   type: string
   *     responses:
   *       200:
   *         description: Onboarding created successfully
   *       500:
   *         description: Internal server error
   */
  async createOnboarding(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = req.user;
      const onboarding = await userService.createOnboarding(
        user?.user_id!,
        req.body
      );
      res.json(onboarding);
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
