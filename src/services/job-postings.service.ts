import JobPosting from "src/models/job-postings.model";

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
}

export default new JobPostingsService(); 