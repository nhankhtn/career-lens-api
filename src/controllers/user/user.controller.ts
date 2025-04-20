import { Response, Request, NextFunction } from "express";
import userService from "../../services/user.service";
import { StatusCodes } from "../../utils/api-error";
import { CustomRequest, ProfileResponse } from "../../common/types";

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
      const profileData = await userService.getProfileByUserId(user?.user_id!);

      res.json(profileData);
      return;
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * @swagger
   * /api/v1/users/profile:
   *   get:
   *     summary: Get user profile
   *     description: Get the authenticated user's profile information (same as /info)
   *     tags:
   *       - User
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Profile information retrieved successfully
   */
  getProfile(req: CustomRequest, res: Response, next: NextFunction): void {
    try {
      this.getInfo(req, res, next);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/users/profile/{userId}:
   *   get:
   *     summary: Get user profile by ID
   *     description: Get a user's profile information by their user ID
   *     tags:
   *       - User
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *         description: User ID
   *     responses:
   *       200:
   *         description: Profile information retrieved successfully
   */
  getProfileById(req: Request, res: Response, next: NextFunction): void {
    try {
      const { userId } = req.params;
      userService.getProfileByUserId(userId)
        .then(profile => res.json(profile))
        .catch(error => next(error));
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/users/profile/analytics/{userId}:
   *   get:
   *     summary: Get user profile analytics
   *     description: Get a user's profile analytics information including views, stars, and searches
   *     tags:
   *       - User
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *         description: User ID
   *     responses:
   *       200:
   *         description: Profile analytics retrieved successfully
   */
  getProfileAnalytics(req: Request, res: Response, next: NextFunction): void {
    try {
      const { userId } = req.params;
      userService.getProfileAnalytics(userId)
        .then(analytics => res.json(analytics))
        .catch(error => next(error));
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/users/profile:
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
   *               phone:
   *                 type: string
   *               photo_url:
   *                 type: string
   *               bio:
   *                 type: string
   *               address:
   *                 type: string
   *               year:
   *                 type: number
   *               school:
   *                 type: string
   *               quote:
   *                 type: string
   *               social_media:
   *                 type: object
   *     responses:
   *       200:
   *         description: Profile updated successfully
   */
  updateProfile(req: CustomRequest, res: Response, next: NextFunction): void {
    try {
      const userId = req.user?.user_id;
      if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json({ 
          message: "Unauthorized" 
        });
        return;
      }

      const profileData = req.body;
      userService.updateProfile(userId, profileData)
        .then(updatedProfile => res.json(updatedProfile))
        .catch(error => next(error));
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/users/profile/{userId}/star:
   *   post:
   *     summary: Add a star to user profile
   *     description: Increment the star count for a user's profile
   *     tags:
   *       - User
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *         description: User ID
   *     responses:
   *       200:
   *         description: Star added successfully
   */
  addStar(req: Request, res: Response, next: NextFunction): void {
    try {
      const userId = req.params.userId;
      userService.addStar(userId)
        .then(result => res.json(result))
        .catch(error => next(error));
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/users/profile/search:
   *   post:
   *     summary: Increment search count
   *     description: Increment the search count for the user's profile
   *     tags:
   *       - User
   *     parameters:
   *       - in: query
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *         description: User ID
   *     responses:
   *       200:
   *         description: Search count incremented successfully
   */
  incrementSearch(req: Request, res: Response, next: NextFunction): void {
    try {
      const { userId } = req.query as { userId: string };
      if (!userId) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: "User ID is required"
        });
        return;
      }
      
      userService.incrementSearch(userId)
        .then(result => res.json(result))
        .catch(error => next(error));
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/users/profile/courses:
   *   post:
   *     summary: Add or update a course
   *     description: Add a new course or update an existing course for the authenticated user's profile
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
   *             required:
   *               - title
   *               - description
   *             properties:
   *               id:
   *                 type: string
   *                 description: Course ID (optional for new courses)
   *               title:
   *                 type: string
   *               description:
   *                 type: string
   *               icon:
   *                 type: string
   *               progress:
   *                 type: number
   *     responses:
   *       200:
   *         description: Course added or updated successfully
   */
  addOrUpdateCourse(req: CustomRequest, res: Response, next: NextFunction): void {
    try {
      const userId = req.user?.user_id;
      if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json({ 
          message: "Unauthorized" 
        });
        return;
      }

      const courseData = req.body;
      userService.addOrUpdateCourse(userId, courseData)
        .then(updatedProfile => res.json(updatedProfile))
        .catch(error => next(error));
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/users/profile/courses/{courseId}:
   *   delete:
   *     summary: Remove a course
   *     description: Remove a course from the authenticated user's profile
   *     tags:
   *       - User
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: courseId
   *         required: true
   *         schema:
   *           type: string
   *         description: Course ID
   *     responses:
   *       200:
   *         description: Course removed successfully
   */
  removeCourse(req: CustomRequest, res: Response, next: NextFunction): void {
    try {
      const userId = req.user?.user_id;
      if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json({ 
          message: "Unauthorized" 
        });
        return;
      }

      const { courseId } = req.params;
      userService.removeCourse(userId, courseId)
        .then(updatedProfile => res.json(updatedProfile))
        .catch(error => next(error));
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
