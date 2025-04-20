import { RootFilterQuery } from "mongoose";
import { GeneralQueryProps } from "src/common/types";
import { CreateTopicInput } from "src/controllers/topic/dto/create-topic.dto";
import { UpdateTopicInput } from "src/controllers/topic/dto/update-topic.dto";
import Topic, { ITopic } from "src/models/topic.model";
import { ApiError, StatusCodes } from "src/utils/api-error";

class TopicService {
  async create(body: CreateTopicInput) {
    try {
      const topic = new Topic(body);
      await topic.save();
      console.log("Topic created successfully");
      return topic;
    } catch (error) {
      throw error;
    }
  }

  async findAll(query: GeneralQueryProps) {
    try {
      const { offset = 0, limit = 10, key } = query;

      const filter: RootFilterQuery<ITopic> = { level: 1, deleted_at: null };
      if (key) {
        filter.title = { $regex: key, $options: "i" }; // Tìm kiếm không phân biệt chữ hoa chữ thường
      }
      const topics = await Topic.find(filter)
        .skip(offset)
        .limit(limit)
        .sort({ created_at: -1 }); // Sắp xếp theo ngày tạo mới nhất trước
      const total = await Topic.countDocuments(filter);
      console.log("Get topics successfully");
      return {
        data: topics,
        total: total,
      };
    } catch (error) {
      throw error;
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
      const topicChild = await Topic.find({
        parent_id: topic.id,
        delete_at: null,
      });
      let parent = null;
      if (topic.parent_id) {
        parent = await Topic.findById(topic.parent_id);
      }
      console.log("Get topic successfully");
      return {
        topic: topic,
        childs: topicChild,
        parent: parent,
      };
    } catch (error) {
      throw error;
    }
  }

  // Cập nhật thông tin chủ đề
  async update(id: string, updateTopicDto: UpdateTopicInput) {
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
      console.log("Update topic successfully");
      return topic;
    } catch (error) {
      throw error;
    }
  }

  // Xóa chủ đề
  async remove(id: string, delete_by: string) {
    try {
      const topic = await Topic.findByIdAndUpdate(
        id,
        { deleted_at: new Date(), deleted_by: delete_by },
        { new: true }
      );
      if (!topic) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          "Topic not found",
          "topic.service/remove",
          true
        );
      }
      console.log("Topic deleted successfully");
      return {
        message: "Topic deleted successfully",
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new TopicService();
