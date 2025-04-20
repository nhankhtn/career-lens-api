import { Request, Response, NextFunction } from "express";
import jobPostingsStatsService from "src/services/job-postings-stats.service";

class JobPostingsStatsController {
  /**
   * @swagger
   * /api/v1/job-postings/experience-stats:
   *   get:
   *     summary: Lấy thống kê tin tuyển dụng theo cấp độ kinh nghiệm
   *     description: Trả về số lượng tin tuyển dụng trong từng khoảng kinh nghiệm (0 năm, 1-2 năm, 3-5 năm, 6-9 năm, 10+ năm)
   *     tags: [JobPostings]
   *     responses:
   *       200:
   *         description: Thống kê được lấy thành công
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 labels:
   *                   type: array
   *                   items:
   *                     type: string
   *                   example: ["0 năm kinh nghiệm", "1-2 năm kinh nghiệm", "3-5 năm kinh nghiệm", "6-9 năm kinh nghiệm", "10+ năm kinh nghiệm"]
   *                 data:
   *                   type: array
   *                   items:
   *                     type: integer
   *                   example: [15, 25, 40, 30, 20]
   *                 colors:
   *                   type: array
   *                   items:
   *                     type: string
   *                   example: ["#6366F1", "#34D399", "#EC4899", "#F97316", "#6366F1"]
   *                 totalJobs:
   *                   type: integer
   *                   example: 130
   */
  async getJobPostingsByExperienceLevel(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await jobPostingsStatsService.getJobPostingsByExperienceLevelStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}

export default new JobPostingsStatsController(); 