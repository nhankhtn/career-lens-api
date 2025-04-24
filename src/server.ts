import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { createServer } from "http"; // Thêm để tạo HTTP server
import { Server } from "socket.io"; // Thêm Socket.IO

import { connectDB } from "./config/database";
import { errorHandler } from "./middlewares/error-handler.middlleware";
import { jwtAuthMiddlewareSocket } from "./middlewares/jwt-auth.middleware"; // Middleware xác thực cho Socket.IO
import configEnv from "./config/env";
import route from "./routes";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { getSwaggerOptions } from "./config/swagger";

// Kết nối database
connectDB();

const app = express();
const httpServer = createServer(app); // Tạo HTTP server từ Express
const io = new Server(httpServer, {
  cors: {
    origin: configEnv.CLIENT_URL, // Cho phép client kết nối (Angular hoặc các client khác)
    methods: ["GET", "POST"],
  },
});

// Middleware Express
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

route(app);

// Swagger documentation
const swaggerSpec = swaggerJSDoc(getSwaggerOptions(configEnv.BASE_URL));
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  })
);

// Middleware xử lý lỗi
app.use(errorHandler);

// Xác thực Socket.IO
io.use(jwtAuthMiddlewareSocket);

// Xử lý các sự kiện Socket.IO
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Người dùng tham gia phòng của họ (dựa trên user_id)
  const user = (socket as any).user;
  if (user) {
    socket.join(user.user_id); // Tham gia phòng theo user_id
    console.log(`User ${user.user_id} joined their room`);
  }

  // Tham gia phòng của bài viết
  socket.on("joinPostRoom", (postId: string) => {
    socket.join(postId);
    console.log(`User ${user.user_id} joined post room ${postId}`);
  });

  // Rời phòng của bài viết
  socket.on("leavePostRoom", (postId: string) => {
    socket.leave(postId);
    console.log(`User ${user.user_id} left post room ${postId}`);
  });

  // Ngắt kết nối
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Xuất io để sử dụng ở các file khác (như PostService, CommentService)
export { io };

// Khởi động server
httpServer.listen(configEnv.PORT, () => {
  console.log(`Server is running on port ${configEnv.PORT}`);
  console.log(`Swagger documentation available at ${configEnv.BASE_URL}/api-docs`);
});