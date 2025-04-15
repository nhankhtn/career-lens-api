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
   *     summary: Get user information
   *     description: Retrieve the authenticated user's information
   *     tags:
   *       - User
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User information retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
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
      const data = await userService.getUserById(user?.user_id!);

      res.json(data);
      return;
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
