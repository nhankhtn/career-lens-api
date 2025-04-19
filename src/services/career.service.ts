import { RootFilterQuery } from "mongoose";
import { CareerQueryInput } from "src/controllers/career/dto/career-query.dto";
import { CreateCareerInput } from "src/controllers/career/dto/create-career.dto";
import { UpdateCareerInput } from "src/controllers/career/dto/update-career.dto";
import Career, { ICareer } from "src/models/career.model";
import { ApiError, StatusCodes } from "src/utils/api-error";

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
        experience_level,
      } = query;
      console.log("query", query);
      const filter: RootFilterQuery<ICareer> = {};
      if (key) {
        filter.title = { $regex: key, $options: "i" }; // Tìm kiếm không phân biệt chữ hoa chữ thường
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
      if (experience_level) {
        filter.experience_level = experience_level;
      }
      const careers = await Career.find(filter)
        // .populate({
        //   path: "skills",
        //   select: "name",
        // })
        .skip(offset)
        .limit(limit)
        .sort({ createdAt: -1 }); // Sắp xếp theo ngày tạo mới nhất trước
      const total = await Career.countDocuments(filter);
      console.log("Get topics successfully");
      return {
        data: careers,
        total: total,
      };
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string) {
    try {
      const career = await Career.findById(id);
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

  // Cập nhật thông tin chủ đề
  async update(id: string, body: UpdateCareerInput) {
    try {
      const career = await Career.findByIdAndUpdate(id, body, {
        new: true,
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
      console.log("career deleted successfully");
      return {
        message: "Career deleted successfully",
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new CareerService();
