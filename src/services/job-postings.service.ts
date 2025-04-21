import JobPosting from "src/models/job-postings.model";
import ExperienceLevel from "src/models/experience_level.model";

class JobPostingsService {
  async getPositionStats(limit = 5) {
    try {
      // Aggregate to count job postings by position
      const positionStats = await JobPosting.aggregate([
        {
          $lookup: {
            from: "careers", // Changed from "positions" to "careers"
            localField: "position",
            foreignField: "_id",
            as: "positionData",
          },
        },
        {
          $unwind: { path: "$positionData", preserveNullAndEmptyArrays: true },
        },
        {
          $group: {
            _id: "$position",
            positionName: {
              $first: { $ifNull: ["$positionData.name", "Unknown"] },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: limit },
      ]);

      return positionStats.map((stat) => ({
        name: stat.positionName,
        count: stat.count,
      }));
    } catch (error) {
      console.error("Error getting position stats:", error);
      throw error;
    }
  }

  async getTopCompaniesByJobPostings(limit = 5) {
    try {
      // Aggregate to count job postings by company and get company details
      const topCompanies = await JobPosting.aggregate([
        {
          $group: {
            _id: "$company_id",
            jobCount: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "companies",
            localField: "_id",
            foreignField: "_id",
            as: "companyData",
          },
        },
        {
          $unwind: "$companyData",
        },
        {
          $project: {
            _id: 1,
            jobCount: 1,
            name: "$companyData.name",
            industry: "$companyData.industry",
            location: "$companyData.location",
            photo_url: "$companyData.photo_url",
            website_urls: "$companyData.website_urls",
            size: "$companyData.size",
          },
        },
        { $sort: { jobCount: -1 } },
        { $limit: limit },
      ]);

      return topCompanies.map((company) => ({
        id: company._id,
        name: company.name,
        job_count: company.jobCount,
        industry: company.industry,
        location: company.location,
        photo_url: company.photo_url,
        website_urls: company.website_urls,
        size: company.size,
      }));
    } catch (error) {
      console.error("Error getting top companies by job postings:", error);
      throw error;
    }
  }

  async getJobPostingsByExperienceLevelStats() {
    try {
      // First get all experience levels to use for categorization
      const experienceLevels = await ExperienceLevel.find()
        .sort({ yof_min: 1 })
        .lean();

      // Lookup job postings with their experience level data
      const jobPostings = await JobPosting.aggregate([
        {
          $lookup: {
            from: "experience_levels",
            localField: "yof",
            foreignField: "_id",
            as: "experienceData",
          },
        },
        {
          $unwind: {
            path: "$experienceData",
            preserveNullAndEmptyArrays: true,
          },
        },
      ]);

      const experienceCategories = experienceLevels.map((level) => ({
        id: level._id,
        label: this.formatExperienceLabel(level.yof_min, level.yof_max),
        count: 0,
      }));

      for (const posting of jobPostings) {
        const expLevelId = posting.experienceData?._id?.toString();
        if (expLevelId) {
          const categoryIndex = experienceCategories.findIndex(
            (cat) => cat.id.toString() === expLevelId
          );
          if (categoryIndex !== -1) {
            experienceCategories[categoryIndex].count++;
          }
        }
      }

      const totalJobs = experienceCategories.reduce(
        (sum, category) => sum + category.count,
        0
      );

      // Format the response for the chart
      return {
        labels: experienceCategories.map((category) => category.label),
        data: experienceCategories.map((category) => category.count),
        total_jobs: totalJobs,
      };
    } catch (error) {
      console.error("Error getting experience level stats:", error);
      throw error;
    }
  }

  async getTopSkillsDemandStats(limit = 5) {
    try {
      // Get total job posting count for percentage calculation
      const totalJobPostings = await JobPosting.countDocuments();

      // Aggregate to get skill counts in job postings
      const skillDemandInJobs = await JobPosting.aggregate([
        { $unwind: "$skills" },
        {
          $lookup: {
            from: "skills",
            localField: "skills",
            foreignField: "_id",
            as: "skillData",
          },
        },
        { $unwind: "$skillData" },
        {
          $group: {
            _id: "$skillData._id",
            skillName: { $first: "$skillData.name" },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 1,
            skillName: 1,
            count: 1,
            percentage: {
              $multiply: [{ $divide: ["$count", totalJobPostings] }, 100],
            },
          },
        },
        { $sort: { percentage: -1 } },
        { $limit: limit },
      ]);

      const skillStats = skillDemandInJobs.map((skill) => {
        const applicantPercentage = Math.floor(Math.random() * 20) + 1;

        return {
          skillName: skill.skillName,
          recruitmentDemandPercentage: Math.round(skill.percentage),
          applicantPercentage: applicantPercentage,
        };
      });

      return skillStats;
    } catch (error) {
      console.error("Error getting skill demand stats:", error);
      throw error;
    }
  }

  async getJobPostingsHeatmapData(year?: number) {
    try {
      const targetYear = year || new Date().getFullYear();
      const startDate = new Date(targetYear, 0, 1); // January 1st of target year
      const endDate = new Date(targetYear, 11, 31, 23, 59, 59); // December 31st of target year

      // Query job postings within the specified year
      const jobPostings = await JobPosting.find({
        date_posted: {
          $gte: startDate,
          $lte: endDate,
        },
      }).lean();

      const result = Array(4)
        .fill(0)
        .map(() => Array(12).fill(0));

      jobPostings.forEach((posting) => {
        const postDate = new Date(posting.date_posted);
        const month = postDate.getMonth();
        const week = Math.floor((postDate.getDate() - 1) / 7);

        if (week >= 0 && week < 4) {
          result[week][month]++;
        }
      });

      return result;
    } catch (error) {
      console.error("Error getting job postings heatmap data:", error);
      throw error;
    }
  }

  private formatExperienceLabel(min: number, max?: number): string {
    if (!max && min === 0) {
      return "0 năm kinh nghiệm";
    }

    if (!max && min >= 10) {
      return "10+ năm kinh nghiệm";
    }

    if (min === 0 && max === 0) {
      return "0 năm kinh nghiệm";
    }

    return `${min}-${max} năm kinh nghiệm`;
  }
}

export default new JobPostingsService();
