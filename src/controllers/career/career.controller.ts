import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "../../utils/api-error";
import { CustomRequest } from "src/common/types";
import careerService from "src/services/career.service";
import { CareerQueryDto } from "./dto/career-query.dto";

class CareerController {
  /**
   * @swagger
   * /api/v1/careers/api-status:
   *   get:
   *     summary: Check API status
   *     description: Returns the current status of the API
   *     tags: [Career]
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

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const career = await careerService.create(req.body);
      res.status(StatusCodes.CREATED).json(career);
      return;
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/careers:
   *   get:
   *     summary: Get all careers
   *     description: Retrieve a list of careers with pagination
   *     tags: [Career]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *         description: Page number
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *         description: Number of items per page
   *       - in: query
   *         name: skill
   *         schema:
   *           oneOf:
   *             - type: string
   *             - type: array
   *               items:
   *                 type: string
   *         description: Lọc theo kỹ năng (1 hoặc nhiều tên)
   *       - in: query
   *         name: min_salary
   *         schema:
   *           type: integer
   *           minimum: 0
   *         description: Lọc salary >= giá trị này
   *       - in: query
   *         name: max_salary
   *         schema:
   *           type: integer
   *           minimum: 0
   *         description: Lọc salary <= giá trị này
   *       - in: query
   *         name: major
   *         schema:
   *           type: string
   *         description: Lọc theo chuyên ngành (topic_id)
   *       - in: query
   *         name: experience_level
   *         schema:
   *           type: string
   *         description: Lọc theo cấp độ kinh nghiệm
   *     responses:
   *       200:
   *         description: List of careers
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Career'
   *                 total:
   *                   type: number
   *                   description: Total number of items
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const query = CareerQueryDto.parse(req.query);
      const result = await careerService.findAll(query);
      res.json(result);
      return;
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/careers/{id}:
   *   get:
   *     summary: Get career by ID
   *     description: Retrieve a specific career by its ID
   *     tags: [Career]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Career ID
   *     responses:
   *       200:
   *         description: Career details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Career'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       404:
   *         description: Career not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await careerService.findById(req.params.id);
      res.json(data);
      return;
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const topic = await careerService.update(req.params.id, req.body);
      res.json(topic);
      return;
    } catch (error) {
      next(error);
    }
  }

  async remove(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      const result = await careerService.remove(
        req.params.id,
        user?.user_id || ""
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new CareerController();
