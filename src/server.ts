import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";

import { connectDB } from "./config/database";
import { errorHandler } from "./middlewares/error-handler.middlleware";
import configEnv from "./config/env";
import route from "./routes";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { getSwaggerOptions } from "./config/swagger";

// Kết nối database
connectDB();

const app = express();

// Middleware để xử lý CORS
app.use(cors());
// Middleware để ghi log request
app.use(morgan("dev"));
// Middleware để parse JSON body
app.use(express.json());
// Middleware để parse URL-encoded body
app.use(express.urlencoded({ extended: true }));

route(app);

// Swagger documentation
const swaggerSpec = swaggerJSDoc(getSwaggerOptions(configEnv.BASE_URL));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

app.listen(configEnv.PORT, () => {
  console.log(`Server is running on port ${configEnv.PORT}`);
  console.log(
    `Swagger documentation available at ${configEnv.BASE_URL}/api-docs`
  );
});
