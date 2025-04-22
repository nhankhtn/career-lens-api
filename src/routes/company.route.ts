import express from "express";
import { validate } from "src/middlewares/validator.middleware";
import { z } from "zod";
import companyStatsController from "src/controllers/company/company-stats.controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Companies
 *   description: Company API
 */

// Get top companies statistics
router.get("/stats/top", companyStatsController.getTopCompaniesStats);

// Get specific company statistics
router.get("/stats/:name", companyStatsController.getCompanyStats);

export default router; 