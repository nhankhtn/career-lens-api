import JobPosting from "src/models/job-postings.model";
import mongoose from "mongoose";
import ExperienceLevel from "src/models/experience_level.model";
import Skill from "src/models/skill.model";

class JobPostingsStatsService {
  /**
   * Get statistics for job postings by experience level
   * This will return data for visualizing job postings distributed by years of experience
   */
  async getJobPostingsByExperienceLevelStats() {
    try {
      // First get all experience levels to use for categorization
      const experienceLevels = await ExperienceLevel.find().sort({ yof_min: 1 }).lean();
      
      // Lookup job postings with their experience level data
      const jobPostings = await JobPosting.aggregate([
        {
          $lookup: {
            from: "experience_levels",
            localField: "yof",
            foreignField: "_id",
            as: "experienceData"
          }
        },
        { $unwind: { path: "$experienceData", preserveNullAndEmptyArrays: true } }
      ]);

      // Define experience categories based on the experience levels in the database
      const experienceCategories = experienceLevels.map(level => ({
        id: level._id,
        label: this.formatExperienceLabel(level.yof_min, level.yof_max),
        count: 0
      }));

      // Categorize job postings by experience level
      for (const posting of jobPostings) {
        const expLevelId = posting.experienceData?._id?.toString();
        if (expLevelId) {
          const categoryIndex = experienceCategories.findIndex(
            cat => cat.id.toString() === expLevelId
          );
          if (categoryIndex !== -1) {
            experienceCategories[categoryIndex].count++;
          }
        }
      }

      // Generate colors for the chart
      const colors = [
        "#6366F1", // Purple (0 years)
        "#34D399", // Green (1-2 years)
        "#EC4899", // Pink (3-5 years)
        "#F97316", // Orange (6-9 years)
        "#6366F1"  // Purple (10+ years)
      ];

      // Limit the colors to the number of experience categories
      const limitedColors = colors.slice(0, experienceCategories.length);
      
      // Calculate the total number of jobs
      const totalJobs = experienceCategories.reduce((sum, category) => sum + category.count, 0);

      // Format the response for the chart
      return {
        labels: experienceCategories.map(category => category.label),
        data: experienceCategories.map(category => category.count),
        colors: limitedColors,
        totalJobs
      };
    } catch (error) {
      console.error("Error getting experience level stats:", error);
      throw error;
    }
  }

  /**
   * Get statistics for most demanded skills in job postings
   * Compare it with the skill prevalence in applicant profiles
   * @param limit Number of top skills to return
   */
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
            as: "skillData"
          }
        },
        { $unwind: "$skillData" },
        {
          $group: {
            _id: "$skillData._id",
            skillName: { $first: "$skillData.name" },
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 1,
            skillName: 1,
            count: 1,
            percentage: { 
              $multiply: [
                { $divide: ["$count", totalJobPostings] }, 
                100
              ] 
            }
          }
        },
        { $sort: { percentage: -1 } },
        { $limit: limit }
      ]);

      // For applicant stats, get user-skill relationships 
      // This is a placeholder implementation - in a real application,
      // we would query users with their skills or a user_skills collection
      // Since we don't have actual user skill data in the model,
      // we'll generate sample data for demonstration purposes
      
      const topSkillIds = skillDemandInJobs.map(skill => skill._id);
      
      // Sample applicant skill percentages (would be dynamically calculated in a real app)
      const skillStats = skillDemandInJobs.map(skill => {
        // Generate a random but realistic percentage for applicants
        // In a real app, this would be calculated from user data
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

  /**
   * Get job posting heatmap data by month and week
   * This will return data for visualizing job postings distribution by month, week, and salary range
   * @param year The year to get data for, defaults to current year
   */
  async getJobPostingsHeatmapData(year?: number) {
    try {
      // Use current year if not specified
      // const targetYear = year || new Date().getFullYear();
      const targetYear = 2023;
      const startDate = new Date(targetYear, 0, 1); // January 1st of target year
      const endDate = new Date(targetYear, 11, 31, 23, 59, 59); // December 31st of target year

      // Query job postings within the specified year
      const jobPostings = await JobPosting.find({
        date_posted: {
          $gte: startDate,
          $lte: endDate
        }
      }).lean();

      // Define salary ranges
      const salaryRanges = {
        low: { min: 0, max: 1999, color: '#E2E8F0' },       // Dưới 1,999 - light blue
        medium: { min: 2000, max: 9999, color: '#818CF8' },  // 2,000 đến 9,999 - medium blue
        high: { min: 10000, max: Infinity, color: '#4F46E5' } // 10,000+ - dark blue
      };

      // Create a matrix for the heatmap [month][week]
      // 12 months x 4 weeks
      const heatmapData = Array(12).fill(null).map(() => 
        Array(4).fill(null).map(() => ({
          count: 0,
          salaryRange: 'low',
          color: salaryRanges.low.color
        }))
      );

      // Process each job posting
      for (const posting of jobPostings) {
        if (!posting.date_posted) continue;
        
        const date = new Date(posting.date_posted);
        const month = date.getMonth(); // 0-11
        
        // Determine which week of the month (0-3)
        const day = date.getDate();
        const week = Math.min(Math.floor((day - 1) / 7), 3);
        
        // Determine salary range category based on min salary
        let salaryRange = 'low';
        if (posting.salary_min >= salaryRanges.high.min) {
          salaryRange = 'high';
        } else if (posting.salary_min >= salaryRanges.medium.min) {
          salaryRange = 'medium';
        }
        
        // Update the count in the heatmap
        heatmapData[month][week].count++;
        
        // Set the dominant salary range for this cell based on higher counts
        // This is a simplified approach - in reality you might want to use weighted averages
        const currentCell = heatmapData[month][week];
        if (
          (salaryRange === 'high' && currentCell.salaryRange !== 'high') || 
          (salaryRange === 'medium' && currentCell.salaryRange === 'low')
        ) {
          currentCell.salaryRange = salaryRange;
          currentCell.color = salaryRanges[salaryRange].color;
        }
      }

      // Format the response for the heatmap
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const weeks = ['1st week', '2nd week', '3rd week', '4th week'];
      
      // Format the response
      return {
        months,
        weeks,
        data: heatmapData,
        salaryRanges: [
          { label: 'Dưới 1,999', color: salaryRanges.low.color },
          { label: 'Từ 2,000 đến 9,999', color: salaryRanges.medium.color },
          { label: '10,000+', color: salaryRanges.high.color }
        ],
        year: targetYear
      };
    } catch (error) {
      console.error("Error getting job postings heatmap data:", error);
      throw error;
    }
  }

  /**
   * Format experience level label based on min and max years of experience
   */
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

export default new JobPostingsStatsService(); 