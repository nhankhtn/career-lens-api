import { Request, Response, NextFunction } from "express";
import companyStatsService from "src/services/company-stats.service";

class CompanyStatsController {
  /**
   * @swagger
   * /api/v1/companies/stats/top:
   *   get:
   *     summary: Get top IT companies statistics
   *     description: Returns statistics about top IT companies including job postings count, average and maximum salaries
   *     tags: [Companies]
   *     parameters:
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 5
   *         description: Number of top companies to return
   *     responses:
   *       200:
   *         description: Company statistics retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 companies:
   *                   type: array
   *                   items:
   *                     type: string
   *                   example: ["FPT", "Grap", "VNG", "Viettel Group", "CMC Global"]
   *                 jobPostingCounts:
   *                   type: array
   *                   items:
   *                     type: integer
   *                   example: [350, 290, 260, 160, 120]
   *                 avgSalaries:
   *                   type: array
   *                   items:
   *                     type: integer
   *                   example: [70, 470, 270, 280, 190]
   *                 maxSalaries:
   *                   type: array
   *                   items:
   *                     type: integer
   *                   example: [100, 45, 305, 370, 240]
   */
  async getTopCompaniesStats(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const stats = await companyStatsService.getTopCompaniesStats(limit);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/companies/stats/{name}:
   *   get:
   *     summary: Get statistics for a specific company
   *     description: Returns statistics about a specific company including job postings count, average and maximum salaries
   *     tags: [Companies]
   *     parameters:
   *       - in: path
   *         name: name
   *         schema:
   *           type: string
   *         required: true
   *         description: Company name
   *     responses:
   *       200:
   *         description: Company statistics retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 name:
   *                   type: string
   *                   example: "VNG Corporation"
   *                 postingCount:
   *                   type: integer
   *                   example: 350
   *                 avgSalary:
   *                   type: integer
   *                   example: 70
   *                 maxSalary:
   *                   type: integer
   *                   example: 100
   *       404:
   *         description: Company not found
   */
  async getCompanyStats(req: Request, res: Response, next: NextFunction) {
    try {
      // Decode the URL-encoded company name
      const companyName = decodeURIComponent(req.params.name);
      console.log(`Looking up stats for company: "${companyName}"`);
      
      const stats = await companyStatsService.getCompanyStats(companyName);
      res.json(stats);
    } catch (error) {
      console.error("Error getting company stats:", error);
      next(error);
    }
  }
}

export default new CompanyStatsController(); 