import swaggerJsdoc from "swagger-jsdoc";

const getSwaggerOptions = (url: string): swaggerJsdoc.Options => ({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Career API",
      version: "1.0.0",
      description: "Career API with Swagger documentation",
    },
    servers: [
      {
        url: url,
        description: "Development server",
      },
    ],
    security: [
      {
        bearerAuth: [],
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "User ID",
            },
            name: {
              type: "string",
              description: "User's full name",
            },
            email: {
              type: "string",
              description: "User's email address",
            },
            phone: {
              type: "string",
              description: "User's phone number",
              nullable: true,
            },
            photo_url: {
              type: "string",
              description: "URL to user's profile photo",
              nullable: true,
            },
            role: {
              type: "string",
              description: "User's role",
              enum: ["user", "admin"],
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "User creation timestamp",
            },
            updated_at: {
              type: "string",
              format: "date-time",
              description: "User last update timestamp",
            },
          },
        },
        UserProfile: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "User ID",
            },
            name: {
              type: "string",
              description: "User's full name",
            },
            email: {
              type: "string",
              description: "User's email address",
            },
            phone: {
              type: "string",
              description: "User's phone number",
              nullable: true,
            },
            photo_url: {
              type: "string",
              description: "URL to user's profile photo",
              nullable: true,
            },
            bio: {
              type: "string",
              description: "User's biography",
              nullable: true,
            },
            address: {
              type: "string",
              description: "User's address",
              nullable: true,
            },
            year: {
              type: "number",
              description: "User's year (e.g., graduation year)",
              nullable: true,
            },
            school: {
              type: "string",
              description: "User's school",
              nullable: true,
            },
            quote: {
              type: "string",
              description: "User's quote",
              nullable: true,
            },
            analytics: {
              type: "object",
              properties: {
                weeklyViews: {
                  type: "object",
                  properties: {
                    w1: { type: "number" },
                    w2: { type: "number" },
                    w3: { type: "number" },
                    w4: { type: "number" },
                  },
                },
                totalViews: { type: "number" },
                totalStars: { type: "number" },
                totalSearches: { type: "number" },
              },
            },
            social_media: {
              type: "object",
              nullable: true,
              properties: {
                facebook: { type: "string", nullable: true },
                instagram: { type: "string", nullable: true },
                other: { type: "string", nullable: true },
              },
            },
            courses: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  title: { type: "string" },
                  description: { type: "string" },
                  icon: { type: "string", nullable: true },
                  progress: { type: "number", nullable: true },
                },
              },
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "error",
            },
            message: {
              type: "string",
              example: "Error message",
            },
            stack: {
              type: "string",
              description: "Stack trace (only in development)",
              nullable: true,
            },
          },
        },
        Topic: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Topic ID",
            },
            title: {
              type: "string",
              description: "Topic title",
            },
            level: {
              type: "number",
              description: "Topic level in hierarchy",
            },
            parent_id: {
              type: "string",
              description: "Parent topic ID",
              nullable: true,
            },
            description: {
              type: "string",
              description: "Topic description",
              nullable: true,
            },
            priority: {
              type: "number",
              description: "Topic priority",
              default: 1,
            },
            resources: {
              type: "array",
              description: "List of resources for this topic",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                    description: "Resource ID",
                  },
                  title: {
                    type: "string",
                    description: "Resource title",
                    nullable: true,
                  },
                  type: {
                    type: "string",
                    description: "Resource type",
                    enum: [
                      "Course",
                      "Article",
                      "Video",
                      "Book",
                      "Project",
                      "Interview",
                      "Resource",
                      "Other",
                    ],
                  },
                  url: {
                    type: "string",
                    description: "Resource URL",
                    nullable: true,
                  },
                },
              },
              nullable: true,
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "Topic creation timestamp",
            },
            updated_at: {
              type: "string",
              format: "date-time",
              description: "Topic last update timestamp",
            },
          },
        },
        CreateTopicDto: {
          type: "object",
          required: ["title", "level"],
          properties: {
            title: {
              type: "string",
              description: "Topic title",
            },
            level: {
              type: "number",
              description: "Topic level in hierarchy",
            },
            parent_id: {
              type: "string",
              description: "Parent topic ID",
              nullable: true,
            },
            description: {
              type: "string",
              description: "Topic description",
              nullable: true,
            },
            priority: {
              type: "number",
              description: "Topic priority",
              default: 1,
            },
            resources: {
              type: "array",
              description: "List of resources for this topic",
              items: {
                type: "object",
                properties: {
                  title: {
                    type: "string",
                    description: "Resource title",
                    nullable: true,
                  },
                  type: {
                    type: "string",
                    description: "Resource type",
                    enum: [
                      "Course",
                      "Article",
                      "Video",
                      "Book",
                      "Project",
                      "Interview",
                      "Resource",
                      "Other",
                    ],
                  },
                  url: {
                    type: "string",
                    description: "Resource URL",
                    nullable: true,
                  },
                },
              },
              nullable: true,
            },
          },
        },
        UpdateTopicDto: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "Topic title",
            },
            level: {
              type: "number",
              description: "Topic level in hierarchy",
            },
            parent_id: {
              type: "string",
              description: "Parent topic ID",
              nullable: true,
            },
            description: {
              type: "string",
              description: "Topic description",
              nullable: true,
            },
            priority: {
              type: "number",
              description: "Topic priority",
            },
            resources: {
              type: "array",
              description: "List of resources for this topic",
              items: {
                type: "object",
                properties: {
                  title: {
                    type: "string",
                    description: "Resource title",
                    nullable: true,
                  },
                  type: {
                    type: "string",
                    description: "Resource type",
                    enum: [
                      "Course",
                      "Article",
                      "Video",
                      "Book",
                      "Project",
                      "Interview",
                      "Resource",
                      "Other",
                    ],
                  },
                  url: {
                    type: "string",
                    description: "Resource URL",
                    nullable: true,
                  },
                },
              },
              nullable: true,
            },
          },
        },
        GeneralQueryDto: {
          type: "object",
          properties: {
            offset: {
              type: "integer",
              description: "Số bản ghi bỏ qua (pagination)",
              minimum: 0,
              default: 0,
            },
            limit: {
              type: "integer",
              description: "Số bản ghi trả về tối đa (pagination)",
              minimum: 1,
              default: 10,
            },
            key: {
              type: "string",
              description: "Từ khóa tìm kiếm",
              nullable: true,
            },
          },
        },
        CareerQueryDto: {
          type: "object",
          allOf: [
            { $ref: "#/components/schemas/GeneralQueryDto" },
            {
              type: "object",
              properties: {
                skill: {
                  description: "Lọc theo kỹ năng (1 hoặc nhiều tên)",
                  oneOf: [
                    { type: "string" },
                    { type: "array", items: { type: "string" } },
                  ],
                  nullable: true,
                },
                min_salary: {
                  type: "integer",
                  description: "Lọc salary >= giá trị này",
                  minimum: 0,
                  nullable: true,
                },
                max_salary: {
                  type: "integer",
                  description: "Lọc salary <= giá trị này",
                  minimum: 0,
                  nullable: true,
                },
                major: {
                  type: "string",
                  description: "Lọc theo chuyên ngành (topic_id)",
                  nullable: true,
                },
                experience_level: {
                  type: "string",
                  description: "Lọc theo cấp độ kinh nghiệm",
                  nullable: true,
                },
              },
            },
          ],
        },
        CreateCareerDto: {
          type: "object",
          required: ["name", "description", "average_salary", "growth_rate"],
          properties: {
            name: {
              type: "string",
              description: "Tên nghề nghiệp",
              minLength: 1,
            },
            description: {
              type: "string",
              description: "Mô tả nghề nghiệp",
              minLength: 1,
            },
            average_salary: {
              type: "number",
              description: "Mức lương trung bình",
              minimum: 0,
            },
            growth_rate: {
              type: "number",
              description: "Tốc độ tăng trưởng",
              minimum: 0,
            },
            topic_id: {
              type: "string",
              description: "ID topic chính",
              nullable: true,
            },
            related_topics: {
              type: "array",
              description: "Danh sách ID các topic liên quan",
              items: { type: "string" },
              nullable: true,
            },
            skills: {
              type: "array",
              description: "Danh sách tên kỹ năng",
              items: { type: "string" },
              nullable: true,
            },
          },
        },
        UpdateCareerDto: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Tên nghề nghiệp",
              minLength: 1,
              nullable: true,
            },
            description: {
              type: "string",
              description: "Mô tả nghề nghiệp",
              minLength: 1,
              nullable: true,
            },
            average_salary: {
              type: "number",
              description: "Mức lương trung bình",
              minimum: 0,
              nullable: true,
            },
            growth_rate: {
              type: "number",
              description: "Tốc độ tăng trưởng",
              minimum: 0,
              nullable: true,
            },
            topic_id: {
              type: "string",
              description: "ID topic chính",
              nullable: true,
            },
            related_topics: {
              type: "array",
              description: "Danh sách ID các topic liên quan",
              items: { type: "string" },
              nullable: true,
            },
            skills: {
              type: "array",
              description: "Danh sách tên kỹ năng",
              items: { type: "string" },
              nullable: true,
            },
          },
        },
      },
    },
  },
  apis: [
    "./src/controllers/**/*.ts", // Đọc tất cả các controller files
    "./src/routes/**/*.ts", // Đọc tất cả các route files
    "./src/server.ts", // Đọc server file
  ],
});

export { getSwaggerOptions };
