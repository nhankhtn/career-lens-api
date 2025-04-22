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
      
      // First check if we have job postings and companies
      const jobCount = await JobPosting.countDocuments();
      const companyCount = await Company.countDocuments();
      console.log(`Found ${jobCount} job postings and ${companyCount} companies in the database.`);
      
      // List a few job postings to inspect their company_id
      const sampleJobs = await JobPosting.find().limit(3).lean();
      console.log("Sample job postings:", JSON.stringify(sampleJobs, null, 2));

      // Modified aggregation to be more tolerant of missing company references
      const companyStats = await JobPosting.aggregate([
        {
          // First stage of pipeline - basic grouping by company_id
          $group: {
            _id: "$company_id",
            postingCount: { $sum: 1 },
            avgSalary: { $avg: { $avg: ["$salary_min", { $ifNull: ["$salary_max", "$salary_min"] }] } },
            maxSalary: { $max: { $ifNull: ["$salary_max", "$salary_min"] } }
          }
        },
        // Look up company names in a separate stage
        {
          $lookup: {
            from: "companies", // collection name
            localField: "_id",
            foreignField: "_id",
            as: "company"
          }
        },
        {
          // Project to flatten the result
          $project: {
            companyName: { 
              $cond: [
                { $gt: [{ $size: "$company" }, 0] },
                { $arrayElemAt: ["$company.name", 0] },
                "Unknown Company" // Fallback if no company found
              ]
            },
            postingCount: 1,
            avgSalary: 1,
            maxSalary: 1
          }
        },
        { $sort: { postingCount: -1 } },
        { $limit: limit }
      ]);

      console.log("Company stats found:", JSON.stringify(companyStats, null, 2));

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

      // First find the company by name to get its ID
      const company = await Company.findOne({ name: companyName }).lean();
      
      if (!company) {
        throw new Error(`Company not found: ${companyName}`);
      }
      
      // Get job posting stats using company ID
      const stats = await JobPosting.aggregate([
        {
          $match: {
            company_id: new mongoose.Types.ObjectId(String(company._id))
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