import "src/models";
import { RootFilterQuery } from "mongoose";
import { CareerQueryInput } from "src/controllers/career/dto/career-query.dto";
import { CreateCareerInput } from "src/controllers/career/dto/create-career.dto";
import { UpdateCareerInput } from "src/controllers/career/dto/update-career.dto";
import { ApiError, StatusCodes } from "src/utils/api-error";

// Import models in the correct order
import Career, { ICareer } from "src/models/career.model"; // Then import Career model
import Topic from "src/models/topic.model";

class CareerService {
  async create(body: CreateCareerInput) {
    try {
      const career = new Career(body);
      await career.save();
      console.log("Career created successfully");
      return career;
    } catch (error) {
      throw error;
    }
  }

  async findAll(query: CareerQueryInput) {
    try {
      const {
        offset = 0,
        limit = 10,
        key,
        min_salary,
        max_salary,
        skill,
        major,
      } = query;
      console.log("query", query);
      const filter: RootFilterQuery<ICareer> = {};
      if (key) {
        filter.name = { $regex: key, $options: "i" }; // Tìm kiếm không phân biệt chữ hoa chữ thường
      }
      if (min_salary !== undefined || max_salary !== undefined) {
        filter.average_salary = {};
        if (min_salary !== undefined) filter.average_salary.$gte = min_salary;
        if (max_salary !== undefined) filter.average_salary.$lte = max_salary;
      }
      if (major) {
        filter.topic_id = major;
      }
      if (skill) {
        filter.skills = { $in: [skill] };
      }
      // if (experience_level) {
      //   filter.experience_level = experience_level;
      // }
      const careers = await Career.find(filter)
        .populate({
          path: "skills",
          select: "name",
        })
        .populate({
          path: "topic_id",
          select: "title",
        })
        .skip(offset)
        .limit(limit)
        .sort({ growth_rate: -1 }); // Sắp xếp theo ngày tạo mới nhất trước
      const total = await Career.countDocuments(filter);
      console.log("Get careers successfully");

      const results = await Promise.all(
        careers.map(async (career) => {
          let childrenCount = 0;

          if (career.topic_id) {
            childrenCount = await Topic.countDocuments({
              parent_id: career.topic_id._id,
              deleted_at: null,
            });
          }

          return {
            ...career.toObject(),
            topic: career.topic_id,
            topic_children_count: childrenCount,
          };
        })
      );

      return {
        data: results,
        total: total,
      };
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string) {
    try {
      const career = await Career.findById(id).populate({
        path: "skills",
        select: "name",
      });
      if (!career) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          "Career not found",
          "career.service/findById",
          true
        );
      }
      return career;
    } catch (error) {
      throw error;
    }
  }

  // Cập nhật thông tin career
  async update(id: string, body: UpdateCareerInput) {
    try {
      const career = await Career.findByIdAndUpdate(id, body, {
        new: true,
      }).populate({
        path: "skills",
        select: "name",
      });
      if (!career) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          "Career not found",
          "career.service/update",
          true
        );
      }
      console.log("Update career successfully");
      return career;
    } catch (error) {
      throw error;
    }
  }

  // Xóa chủ đề
  async remove(id: string, delete_by: string) {
    try {
      const career = await Career.findByIdAndUpdate(
        id,
        { deleted_at: new Date(), deleted_by: delete_by },
        { new: true }
      );
      if (!career) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          "Career not found",
          "career.service/remove",
          true
        );
      }
      console.log("Career deleted successfully");
      return {
        message: "Career deleted successfully",
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new CareerService();
