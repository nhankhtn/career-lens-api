import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  QueryParams,
  Res,
} from "routing-controllers";
import { Response } from "express";
import { CreateTopicDto } from "./dto/create-topic.dto";
import topicService from "src/services/topic.service";
import { StatusCodes } from "src/utils/api-error";
import { UpdateTopicDto } from "./dto/update-topic.dto";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { GeneralQueryDto } from "src/utils/general-query";

@OpenAPI({
  security: [{ bearerAuth: [] }],
  tags: ["Topic"],
})
@Controller("/admin/topics")
export class TopicController {
  @Get("/api-status")
  @OpenAPI({
    summary: "Check the status of the API",
    responses: {
      "200": {
        description: "API is running",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                status: { type: "string" },
                message: { type: "string" },
              },
            },
          },
        },
      },
    },
  })
  async apiStatus(@Res() res: Response) {
    try {
      res.json({
        status: "OK",
        message: "API is running",
      });
      return;
    } catch (error) {
      throw error;
    }
  }

  @Post()
  @HttpCode(StatusCodes.CREATED)
  @OpenAPI({
    summary: "Create a new topic",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/CreateTopicDto",
          },
        },
      },
    },
    responses: {
      "201": {
        description: "Topic created successfully",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Topic",
            },
          },
        },
      },
    },
  })
  async create(@Body() body: CreateTopicDto) {
    const topic = await topicService.create(body);
    return topic;
  }

  @Get()
  @OpenAPI({
    summary: "Get all topics",
    parameters: [
      {
        name: "page",
        in: "query",
        required: false,
        schema: { type: "number", default: 1 },
      },
      {
        name: "limit",
        in: "query",
        required: false,
        schema: { type: "number", default: 10 },
      },
    ],
    responses: {
      "200": {
        description: "List of topics",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                data: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Topic",
                  },
                },
                pagination: {
                  type: "object",
                  properties: {
                    total: { type: "number" },
                    page: { type: "number" },
                    limit: { type: "number" },
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  async findAll(@QueryParams() query: GeneralQueryDto) {
    const result = await topicService.findAll(query);
    return result;
  }

  @Get("/:id")
  @OpenAPI({
    summary: "Get topic by ID",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: { type: "string" },
      },
    ],
    responses: {
      "200": {
        description: "Topic details",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Topic",
            },
          },
        },
      },
    },
  })
  async findById(@Param("id") id: string) {
    const topic = await topicService.findById(id);
    return topic;
  }

  @Put("/:id")
  @OpenAPI({
    summary: "Update topic",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: { type: "string" },
      },
    ],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UpdateTopicDto",
          },
        },
      },
    },
    responses: {
      "200": {
        description: "Topic updated successfully",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Topic",
            },
          },
        },
      },
    },
  })
  async update(@Param("id") id: string, @Body() body: UpdateTopicDto) {
    const topic = await topicService.update(id, body);
    return topic;
  }

  @Delete("/:id")
  @OpenAPI({
    summary: "Delete topic",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: { type: "string" },
      },
    ],
    responses: {
      "204": {
        description: "Topic deleted successfully",
      },
    },
  })
  async remove(@Param("id") id: string) {
    await topicService.remove(id);
    return;
  }
}
