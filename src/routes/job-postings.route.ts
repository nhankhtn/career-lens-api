import express from "express";
import { validate } from "src/middlewares/validator.middleware";
import { z } from "zod";
import jobPostingsController from "src/controllers/job-posting/job-postings.controller";
import jobPostingsStatsController from "src/controllers/job-posting/job-postings-stats.controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: JobPostings
 *   description: Job Postings API
 */

// Get job position statistics
router.get("/position-stats", jobPostingsController.getPositionStats);

// Get job postings by company ID
router.get("/company/:companyId", jobPostingsController.getJobPostingsByCompany);

// Get job postings by company name
router.get("/company-name/:companyName", jobPostingsController.getJobPostingsByCompanyName);

// Get job experience level statistics
router.get("/experience-stats", jobPostingsStatsController.getJobPostingsByExperienceLevel);

// Get top skills demand statistics
router.get("/skills-demand-stats", jobPostingsStatsController.getTopSkillsDemandStats);

// Get job postings heatmap data
router.get("/heatmap", jobPostingsStatsController.getJobPostingsHeatmap);

export default router; 