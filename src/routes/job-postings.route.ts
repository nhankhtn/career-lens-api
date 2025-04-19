import express from "express";
import { validate } from "src/middlewares/validator.middleware";
import { z } from "zod";
import jobPostingsController from "src/controllers/career/job-postings.controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: JobPostings
 *   description: Job Postings API
 */

// Get job position statistics
router.get("/position-stats", jobPostingsController.getPositionStats);

export default router; 