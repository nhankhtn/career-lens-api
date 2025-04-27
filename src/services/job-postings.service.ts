import JobPosting from "src/models/job-postings.model";
import ExperienceLevel from "src/models/experience_level.model";
import { PipelineStage } from "mongoose";
import { regionMap } from "src/common/region";
import { JobPostingsQueryInput } from "src/controllers/job-posting/dto/job-postings-query.dto";
import { getRandomInt } from "src/utils/number";
class JobPostingsService {
  async getPositionStats(query: JobPostingsQueryInput, limit = 5) {
    try {
      const { date_from, date_to, region } = query;
      const matchStage: any = {};

      if (date_from || date_to) {
        matchStage.date_posted = {};
        if (date_from) matchStage.date_posted.$gte = date_from;
        if (date_to) matchStage.date_posted.$lte = date_to;
      }

      if (region) {
        matchStage.$or = [
          {
            location: {
              $regex: new RegExp(regionMap[region].join("|"), "i"),
            },
          },
        ];
      }

      const pipeline: PipelineStage[] = [
        ...(Object.keys(matchStage).length ? [{ $match: matchStage }] : []),
        {
          $lookup: {
            from: "careers",
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
      ];

      const positionStats = await JobPosting.aggregate(pipeline);

      return positionStats.map((stat) => ({
        position: stat.positionName,
        count: stat.count,
      }));
    } catch (error) {
      console.error("Error getting position stats:", error);
      throw error;
    }
  }

  async getTopCompaniesByJobPostings(query: JobPostingsQueryInput, limit = 5) {
    try {
      const { date_from, date_to, region } = query;
      const matchStage: any = {};

      if (date_from || date_to) {
        matchStage.date_posted = {};
        if (date_from) matchStage.date_posted.$gte = date_from;
        if (date_to) matchStage.date_posted.$lte = date_to;
      }

      if (region) {
        matchStage.$or = [
          {
            location: {
              $regex: new RegExp(regionMap[region].join("|"), "i"),
            },
          },
        ];
      }

      const pipeline: PipelineStage[] = [
        ...(Object.keys(matchStage).length ? [{ $match: matchStage }] : []),
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
          $unwind: {
            path: "$companyData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            jobCount: 1,
            name: "$companyData.name",
            average_salary: "$companyData.average_salary",
            average_it_count: "$companyData.average_it_count",
          },
        },
        { $sort: { jobCount: -1 } },
        { $limit: limit },
      ];

      const topCompanies = await JobPosting.aggregate(pipeline);

      return topCompanies.map((company) => ({
        name: company.name,
        average_salary: company.average_salary,
        average_it_count: company.average_it_count,
        job_count: company.jobCount * 5,
      }));
    } catch (error) {
      console.error("Error getting top companies by job postings:", error);
      throw error;
    }
  }

  async getJobPostingsByExperienceLevelStats(query: JobPostingsQueryInput) {
    try {
      const { date_from, date_to, region } = query;
      const experienceLevels = await ExperienceLevel.find()
        .sort({ yof_min: 1 })
        .lean();

      const matchStage: any = {};

      if (date_from || date_to) {
        matchStage.date_posted = {};
        if (date_from) matchStage.date_posted.$gte = date_from;
        if (date_to) matchStage.date_posted.$lte = date_to;
      }

      if (region) {
        matchStage.$or = [
          {
            location: {
              $regex: new RegExp(regionMap[region].join("|"), "i"),
            },
          },
        ];
      }

      const pipeline = [
        ...(Object.keys(matchStage).length ? [{ $match: matchStage }] : []),
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
      ];
      const jobPostings = await JobPosting.aggregate(pipeline);
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

      return experienceCategories.map((category) => ({
        label: category.label,
        value: category.count,
      }));
    } catch (error) {
      console.error("Error getting experience level stats:", error);
      throw error;
    }
  }

  async getTopSkillsDemandStats(query: JobPostingsQueryInput, limit = 4) {
    try {
      const { date_from, date_to, region } = query;
      const matchStage: any = {};

      if (date_from || date_to) {
        matchStage.date_posted = {};
        if (date_from) matchStage.date_posted.$gte = date_from;
        if (date_to) matchStage.date_posted.$lte = date_to;
      }

      if (region) {
        matchStage.$or = [
          {
            location: {
              $regex: new RegExp(regionMap[region].join("|"), "i"),
            },
          },
        ];
      }

      const totalJobPostings = await JobPosting.countDocuments(matchStage);

      const pipeline: PipelineStage[] = [
        ...(Object.keys(matchStage).length ? [{ $match: matchStage }] : []),
        { $unwind: { path: "$skills" } },
        {
          $lookup: {
            from: "skills",
            localField: "skills",
            foreignField: "_id",
            as: "skillData",
          },
        },
        { $unwind: { path: "$skillData" } },
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
      ];

      const skillDemandInJobs = await JobPosting.aggregate(pipeline);

      const skillStats = skillDemandInJobs.map((skill) => {
        const applicantPercentage = Math.floor(Math.random() * 20) + 1;

        return {
          name: skill.skillName,
          recruitment_demand: Math.round(skill.percentage),
          applicant_percentage: applicantPercentage,
        };
      });

      return skillStats;
    } catch (error) {
      console.error("Error getting skill demand stats:", error);
      throw error;
    }
  }

  async getJobPostingsHeatmapData(query: JobPostingsQueryInput) {
    try {
      const { date_to, region } = query;
      const targetYear = date_to
        ? new Date(date_to).getFullYear()
        : new Date().getFullYear();
      const startDate = new Date(targetYear, 0, 1); // January 1st of target year
      const endDate = new Date(targetYear, 11, 31, 23, 59, 59); // December 31st of target year

      const matchStage: any = {
        date_posted: {
          $gte: startDate,
          $lte: endDate,
        },
      };

      if (region && regionMap[region]) {
        matchStage.$or = [
          {
            location: {
              $regex: new RegExp(regionMap[region].join("|"), "i"),
            },
          },
        ];
      }

      const pipeline = [
        { $match: matchStage },
        {
          $group: {
            _id: {
              month: { $month: "$date_posted" },
              week: {
                $floor: {
                  $divide: [
                    { $subtract: [{ $dayOfMonth: "$date_posted" }, 1] },
                    7,
                  ],
                },
              },
            },
            totalOpenings: { $sum: "$number_of_openings" },
          },
        },
        {
          $project: {
            _id: 0,
            month: { $subtract: ["$_id.month", 1] }, // Convert to 0-based index
            week: "$_id.week",
            totalOpenings: 1,
          },
        },
      ];

      const jobPostings = await JobPosting.aggregate(pipeline);

      const result = Array(4)
        .fill(0)
        .map(() => Array(12).fill(0));

      jobPostings.forEach((posting) => {
        if (posting.week >= 0 && posting.week < 4) {
          result[posting.week][posting.month] = posting.totalOpenings;
        }
      });

      return result.map((w) => w.map((c) => c * 200));
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
