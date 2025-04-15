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
    },
  },
  apis: [
    "./src/controllers/topic/*.ts", // Đọc tất cả các controller files
    "./src/routers/topic/*.ts", // Đọc tất cả các controller files
    "./src/server.ts", // Đọc server file
  ],
});

export { getSwaggerOptions };
