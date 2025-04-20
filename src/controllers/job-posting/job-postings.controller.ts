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

  /**
   * @swagger
   * /api/v1/job-postings/company/{companyId}:
   *   get:
   *     summary: Get job postings by company ID
   *     description: Returns paginated job postings for a specific company
   *     tags: [JobPostings]
   *     parameters:
   *       - in: path
   *         name: companyId
   *         schema:
   *           type: string
   *         required: true
   *         description: Company ID
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *         description: Number of job postings to return per page
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Page number
   *     responses:
   *       200:
   *         description: Job postings retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 jobs:
   *                   type: array
   *                   items:
   *                     type: object
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     total:
   *                       type: integer
   *                     page:
   *                       type: integer
   *                     limit:
   *                       type: integer
   *                     pages:
   *                       type: integer
   *       400:
   *         description: Invalid company ID
   */
  async getJobPostingsByCompany(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.params.companyId;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      
      const results = await jobPostingsService.getJobPostingsByCompany(companyId, limit, page);
      res.json(results);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/job-postings/company-name/{companyName}:
   *   get:
   *     summary: Get job postings by company name
   *     description: Returns paginated job postings for a specific company by name
   *     tags: [JobPostings]
   *     parameters:
   *       - in: path
   *         name: companyName
   *         schema:
   *           type: string
   *         required: true
   *         description: Company name
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *         description: Number of job postings to return per page
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Page number
   *     responses:
   *       200:
   *         description: Job postings retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 jobs:
   *                   type: array
   *                   items:
   *                     type: object
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     total:
   *                       type: integer
   *                     page:
   *                       type: integer
   *                     limit:
   *                       type: integer
   *                     pages:
   *                       type: integer
   *       404:
   *         description: Company not found
   */
  async getJobPostingsByCompanyName(req: Request, res: Response, next: NextFunction) {
    try {
      const companyName = decodeURIComponent(req.params.companyName);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      
      const results = await jobPostingsService.getJobPostingsByCompanyName(companyName, limit, page);
      res.json(results);
    } catch (error) {
      next(error);
    }
  }
}

export default new JobPostingsController(); 