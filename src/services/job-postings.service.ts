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
            from: "positions", // Assuming the collection name is "positions"
            localField: "position",
            foreignField: "_id",
            as: "positionData"
          }
        },
        { $unwind: "$positionData" },
        {
          $group: {
            _id: "$position",
            positionName: { $first: "$positionData.name" },
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
      throw error;
    }
  }
}

export default new JobPostingsService(); 