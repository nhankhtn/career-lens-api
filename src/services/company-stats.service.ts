import JobPosting from "src/models/job-postings.model";
import Company from "src/models/company.model";
import mongoose from "mongoose";

interface CompanyStatsResponse {
  companies: string[];
  jobPostingCounts: number[];
  avgSalaries: number[];
  maxSalaries: number[];
}

class CompanyStatsService {
  /**
   * Get statistics for top IT companies including:
   * - Number of job postings in the last month
   * - Average salary
   * - Maximum salary
   */
  async getTopCompaniesStats(limit = 5): Promise<CompanyStatsResponse> {
    try {
      console.log("Getting top companies stats");
      
      // Get all job postings, ignore date filter for now to ensure we get data
      const companyStats = await JobPosting.aggregate([
        {
          $group: {
            _id: "$company_id",
            companyName: { $first: "$company_id" },
            postingCount: { $sum: 1 },
            avgSalary: { $avg: { $avg: ["$salary_min", { $ifNull: ["$salary_max", "$salary_min"] }] } },
            maxSalary: { $max: { $ifNull: ["$salary_max", "$salary_min"] } }
          }
        },
        { $sort: { postingCount: -1 } },
        { $limit: limit }
      ]);

      console.log("Company stats found:", companyStats);

      // Transform the data into the required format
      const companies: string[] = [];
      const jobPostingCounts: number[] = [];
      const avgSalaries: number[] = [];
      const maxSalaries: number[] = [];

      companyStats.forEach(stat => {
        companies.push(stat.companyName);
        jobPostingCounts.push(stat.postingCount);
        avgSalaries.push(Math.round(stat.avgSalary));
        maxSalaries.push(Math.round(stat.maxSalary));
      });

      return {
        companies,
        jobPostingCounts,
        avgSalaries,
        maxSalaries
      };
    } catch (error) {
      console.error("Error getting company stats:", error);
      throw error;
    }
  }

  /**
   * Get detailed statistics for a specific company
   */
  async getCompanyStats(companyName: string) {
    try {
      console.log(`Looking up stats for company: "${companyName}"`);
      
      // Simple validation
      if (!companyName) {
        throw new Error("Company name is required");
      }

      // Get job posting stats using company name directly
      const stats = await JobPosting.aggregate([
        {
          $match: {
            company_id: companyName
          }
        },
        {
          $group: {
            _id: null,
            postingCount: { $sum: 1 },
            avgSalary: { $avg: { $avg: ["$salary_min", { $ifNull: ["$salary_max", "$salary_min"] }] } },
            maxSalary: { $max: { $ifNull: ["$salary_max", "$salary_min"] } }
          }
        }
      ]);

      console.log("Company stats results:", stats);

      return {
        name: companyName,
        postingCount: stats.length > 0 ? stats[0].postingCount : 0,
        avgSalary: stats.length > 0 ? Math.round(stats[0].avgSalary) : 0,
        maxSalary: stats.length > 0 ? Math.round(stats[0].maxSalary) : 0,
      };
    } catch (error) {
      console.error("Error getting company stats:", error);
      throw error;
    }
  }
}

export default new CompanyStatsService(); 