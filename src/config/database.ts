import mongoose from "mongoose";
import configEnv from "./env";

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(configEnv.DATABASE_URL, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
    });

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);

    process.exit(1);
  }
};

export { connectDB };
