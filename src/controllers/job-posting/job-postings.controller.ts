import { Request, Response, NextFunction } from "express";
import jobPostingsService from "src/services/job-postings.service";
import { JobPostingsQueryDto } from "./dto/job-postings-query.dto";

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
      const query = JobPostingsQueryDto.parse(req.query);
      const stats = await jobPostingsService.getPositionStats(query);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/job-postings/company:
   *   get:
   *     summary: Get job postings by company ID
   *     description: Returns paginated job postings for a specific company
   *     tags: [JobPostings]
   *     parameters:
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 5
   *         description: Number of job postings to return per page
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
  async getTopCompaniesByJobPostings(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const query = JobPostingsQueryDto.parse(req.query);
      const results = await jobPostingsService.getTopCompaniesByJobPostings(
        query
      );
      res.json(results);
    } catch (error) {
      next(error);
    }
  }

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
  async getJobPostingsByExperienceLevel(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const query = JobPostingsQueryDto.parse(req.query);
      const stats =
        await jobPostingsService.getJobPostingsByExperienceLevelStats(query);
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
  async getTopSkillsDemandStats(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const query = JobPostingsQueryDto.parse(req.query);
      const stats = await jobPostingsService.getTopSkillsDemandStats(query);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/job-postings/heatmap:
   *   get:
   *     summary: Lấy dữ liệu biểu đồ nhiệt cho tin tuyển dụng
   *     description: Trả về dữ liệu để hiển thị biểu đồ nhiệt tin tuyển dụng theo tháng, tuần và khoảng lương
   *     tags: [JobPostings]
   *     parameters:
   *       - in: query
   *         name: year
   *         schema:
   *           type: integer
   *         description: Năm cần lấy dữ liệu (mặc định là năm hiện tại)
   *     responses:
   *       200:
   *         description: Dữ liệu biểu đồ nhiệt được lấy thành công
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 months:
   *                   type: array
   *                   items:
   *                     type: string
   *                   example: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
   *                 weeks:
   *                   type: array
   *                   items:
   *                     type: string
   *                   example: ["1st week", "2nd week", "3rd week", "4th week"]
   *                 data:
   *                   type: array
   *                   items:
   *                     type: array
   *                     items:
   *                       type: object
   *                       properties:
   *                         count:
   *                           type: integer
   *                           example: 5
   *                         salaryRange:
   *                           type: string
   *                           example: "medium"
   *                         color:
   *                           type: string
   *                           example: "#818CF8"
   *                 salaryRanges:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       label:
   *                         type: string
   *                         example: "Dưới 1,999"
   *                       color:
   *                         type: string
   *                         example: "#E2E8F0"
   *                 year:
   *                   type: integer
   *                   example: 2023
   */
  async getJobPostingsHeatmap(req: Request, res: Response, next: NextFunction) {
    try {
      const query = JobPostingsQueryDto.parse(req.query);
      const heatmapData = await jobPostingsService.getJobPostingsHeatmapData(
        query
      );
      res.json(heatmapData);
    } catch (error) {
      next(error);
    }
  }
}

export default new JobPostingsController();
