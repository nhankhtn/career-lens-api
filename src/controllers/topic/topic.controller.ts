import { Request, Response, NextFunction } from "express";
import topicService from "../../services/topic.service";
import { StatusCodes } from "../../utils/api-error";
import { GeneralQueryDto } from "src/common/types";

class TopicController {
  /**
   * @swagger
   * /api/v1/topics/api-status:
   *   get:
   *     summary: Check API status
   *     description: Returns the current status of the API
   *     tags: [Topic]
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
   * /api/v1/topics:
   *   post:
   *     summary: Create a new topic
   *     description: Create a new topic with the provided details
   *     tags: [Topic]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateTopicDto'
   *     responses:
   *       201:
   *         description: Topic created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Topic'
   *       400:
   *         description: Bad request
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const topic = await topicService.create(req.body);
      res.status(StatusCodes.CREATED).json(topic);
      return;
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/topics:
   *   get:
   *     summary: Get all topics
   *     description: Retrieve a list of topics with pagination
   *     tags: [Topic]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: offset
   *         schema:
   *           type: number
   *           default: 0
   *         description: Offset number
   *       - in: query
   *         name: limit
   *         schema:
   *           type: number
   *           default: 10
   *         description: Number of items per page
   *     responses:
   *       200:
   *         description: List of topics
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Topic'
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
      const query = GeneralQueryDto.parse(req.query);
      const result = await topicService.findAll(query);
      res.json(result);
      return;
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/topics/{id}:
   *   get:
   *     summary: Get topic by ID
   *     description: Retrieve a specific topic by its ID
   *     tags: [Topic]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Topic ID
   *     responses:
   *       200:
   *         description: Topic details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Topic'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       404:
   *         description: Topic not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await topicService.findById(req.params.id);
      res.json(data);
      return;
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/topics/{id}:
   *   put:
   *     summary: Update topic
   *     description: Update an existing topic
   *     tags: [Topic]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Topic ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateTopicDto'
   *     responses:
   *       200:
   *         description: Topic updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Topic'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       404:
   *         description: Topic not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const topic = await topicService.update(req.params.id, req.body);
      res.json(topic);
      return;
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/topics/{id}:
   *   delete:
   *     summary: Delete topic
   *     description: Delete a topic by its ID
   *     tags: [Topic]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Topic ID
   *     responses:
   *       204:
   *         description: Topic deleted successfully
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       404:
   *         description: Topic not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await topicService.remove(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new TopicController();
