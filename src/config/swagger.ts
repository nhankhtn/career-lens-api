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
