import express from "express";
import jobPostingsController from "src/controllers/job-posting/job-postings.controller";
import { z } from "zod";
import { validate } from "src/middlewares/validator.middleware";
import { JobPostingsQueryDto } from "src/controllers/job-posting/dto/job-postings-query.dto";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: JobPostings
 *   description: Job Postings API
 */

// Get job position statistics
router.get(
  "/position-stats",
  validate(z.object({ query: JobPostingsQueryDto })),
  jobPostingsController.getPositionStats
);

// Get job postings by company
router.get(
  "/company",
  validate(z.object({ query: JobPostingsQueryDto })),
  jobPostingsController.getTopCompaniesByJobPostings
);

// Get job experience level statistics
router.get(
  "/experience-stats",
  validate(z.object({ query: JobPostingsQueryDto })),
  jobPostingsController.getJobPostingsByExperienceLevel
);

// Get top skills demand statistics
router.get(
  "/skills-demand-stats",
  validate(z.object({ query: JobPostingsQueryDto })),
  jobPostingsController.getTopSkillsDemandStats
);

// Get job postings heatmap data
router.get(
  "/heatmap",
  validate(z.object({ query: JobPostingsQueryDto })),
  jobPostingsController.getJobPostingsHeatmap
);

export default router;
