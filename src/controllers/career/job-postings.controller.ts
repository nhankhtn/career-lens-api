import { Request, Response, NextFunction } from "express";
import jobPostingsService from "src/services/job-postings.service";

class JobPostingsController {
  /**
   * @swagger
   * /api/v1/job-postings/position-stats:
   *   get:
   *     summary: Get job position statistics
   *     description: Returns statistics about job demand by position
   *     tags: [JobPostings]
   *     parameters:
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 5
   *         description: Number of top positions to return
   *     responses:
   *       200:
   *         description: Position statistics retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   name:
   *                     type: string
   *                     example: "Backend Developer"
   *                   count:
   *                     type: integer
   *                     example: 800
   */
  async getPositionStats(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const stats = await jobPostingsService.getPositionStats(limit);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}

export default new JobPostingsController(); 