import { RootFilterQuery } from "mongoose";
import { CreateTopicDto } from "src/controllers/topic/dto/create-topic.dto";
import { UpdateTopicDto } from "src/controllers/topic/dto/update-topic.dto";
import Topic, { ITopic } from "src/models/topic.model";
import { ApiError, StatusCodes, wrapApiError } from "src/utils/api-error";
import { GeneralQueryProps } from "src/utils/general-query";

class TopicService {
  async create(body: CreateTopicDto) {
    try {
      console.log("creato", body);
      const topic = new Topic(body);
      await topic.save();
      return topic;
    } catch (error) {
      console.log("error", error);
      throw wrapApiError(error);
    }
  }

  async findAll(query: GeneralQueryProps) {
    try {
      const { offset = 0, limit = 10, key } = query;

      const filter: RootFilterQuery<ITopic> = {};
      if (key) {
        filter.title = { $regex: key, $options: "i" }; // Tìm kiếm không phân biệt chữ hoa chữ thường
      }
      const topics = await Topic.find(filter)
        .skip(offset)
        .limit(limit)
        .sort({ createdAt: -1 }); // Sắp xếp theo ngày tạo mới nhất trước
      const total = await Topic.countDocuments(filter);

      return {
        data: topics,
        total: total,
      };
    } catch (error) {
      throw wrapApiError(error);
    }
  }

  async findById(id: string) {
    try {
      const topic = await Topic.findById(id);
      if (!topic) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          "Topic not found",
          "topic.service/findById",
          true
        );
      }
      return topic;
    } catch (error) {
      throw wrapApiError(error);
    }
  }

  // Cập nhật thông tin chủ đề
  async update(id: string, updateTopicDto: UpdateTopicDto) {
    try {
      const topic = await Topic.findByIdAndUpdate(id, updateTopicDto, {
        new: true,
      });
      if (!topic) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          "Topic not found",
          "topic.service/update",
          true
        );
      }
      return topic;
    } catch (error) {
      throw wrapApiError(error);
    }
  }

  // Xóa chủ đề
  async remove(id: string) {
    try {
      const topic = await Topic.findByIdAndDelete(id);
      if (!topic) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          "Topic not found",
          "topic.service/remove",
          true
        );
      }
      return {
        message: "Topic deleted successfully",
      };
    } catch (error) {
      throw wrapApiError(error);
    }
  }
}

export default new TopicService();
