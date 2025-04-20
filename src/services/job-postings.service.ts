import JobPosting from "src/models/job-postings.model";
import mongoose, { Types } from "mongoose";
import Company, { ICompany } from "src/models/company.model";

class JobPostingsService {
  /**
   * Get statistics for job positions by counting job postings per position
   * This will return data for the top positions with the highest demand
   */
  async getPositionStats(limit = 5) {
    try {
      // Aggregate to count job postings by position
      const positionStats = await JobPosting.aggregate([
        {
          $lookup: {
            from: "careers", // Changed from "positions" to "careers"
            localField: "position",
            foreignField: "_id",
            as: "positionData"
          }
        },
        { $unwind: { path: "$positionData", preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: "$position",
            positionName: { $first: { $ifNull: ["$positionData.name", "Unknown"] } },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: limit }
      ]);

      return positionStats.map(stat => ({
        name: stat.positionName,
        count: stat.count
      }));
    } catch (error) {
      console.error("Error getting position stats:", error);
      throw error;
    }
  }

  /**
   * Get job postings by company ID
   * @param companyId The company ObjectId
   * @param limit Limit number of results
   * @param page Page number for pagination
   */
  async getJobPostingsByCompany(companyId: string, limit = 10, page = 1) {
    try {
      const skip = (page - 1) * limit;
      
      // Validate companyId
      if (!mongoose.Types.ObjectId.isValid(companyId)) {
        throw new Error("Invalid company ID");
      }
      
      // Find job postings for the company with populated references
      const jobPostings = await JobPosting.find({ 
        company_id: new mongoose.Types.ObjectId(companyId) 
      })
      .populate("position", "name")
      .populate("yof", "title yof_min yof_max")
      .populate("skills", "name")
      .sort({ date_posted: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
      
      // Get total count for pagination
      const total = await JobPosting.countDocuments({ 
        company_id: new mongoose.Types.ObjectId(companyId) 
      });
      
      return {
        jobs: jobPostings,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error("Error getting job postings by company:", error);
      throw error;
    }
  }

  /**
   * Get job postings by company name
   * @param companyName The company name
   * @param limit Limit number of results
   * @param page Page number for pagination
   */
  async getJobPostingsByCompanyName(companyName: string, limit = 10, page = 1) {
    try {
      // Find the company by name
      const company = await Company.findOne({ name: companyName });
      
      if (!company) {
        throw new Error(`Company not found: ${companyName}`);
      }
      
      // Get job postings with the company ID
      const companyId = company._id ? company._id.toString() : "";
      return this.getJobPostingsByCompany(companyId, limit, page);
    } catch (error) {
      console.error("Error getting job postings by company name:", error);
      throw error;
    }
  }
}

export default new JobPostingsService(); 