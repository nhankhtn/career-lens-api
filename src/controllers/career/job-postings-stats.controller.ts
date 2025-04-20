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

  /**
   * @swagger
   * /api/v1/job-postings/skills-demand-stats:
   *   get:
   *     summary: Lấy thống kê về kỹ năng đang được yêu cầu nhiều nhất
   *     description: Trả về danh sách các kỹ năng phổ biến nhất trong tin tuyển dụng cùng với tỷ lệ xuất hiện trong hồ sơ ứng viên
   *     tags: [JobPostings]
   *     parameters:
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 5
   *         description: Số lượng kỹ năng cần lấy
   *     responses:
   *       200:
   *         description: Thống kê được lấy thành công
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   skillName:
   *                     type: string
   *                     example: "Computer Science"
   *                   recruitmentDemandPercentage:
   *                     type: integer
   *                     example: 27
   *                   applicantPercentage:
   *                     type: integer
   *                     example: 2
   */
  async getTopSkillsDemandStats(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const stats = await jobPostingsStatsService.getTopSkillsDemandStats(limit);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}

export default new JobPostingsStatsController(); 