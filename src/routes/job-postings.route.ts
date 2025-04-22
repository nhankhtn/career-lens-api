import express from "express";
import jobPostingsController from "src/controllers/job-posting/job-postings.controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: JobPostings
 *   description: Job Postings API
 */

// Get job position statistics
router.get("/position-stats", jobPostingsController.getPositionStats);

// Get job postings by company
router.get("/company", jobPostingsController.getTopCompaniesByJobPostings);

// Get job experience level statistics
router.get(
  "/experience-stats",
  jobPostingsController.getJobPostingsByExperienceLevel
);

// Get top skills demand statistics
router.get(
  "/skills-demand-stats",
  jobPostingsController.getTopSkillsDemandStats
);

// Get job postings heatmap data
router.get("/heatmap", jobPostingsController.getJobPostingsHeatmap);

export default router;
