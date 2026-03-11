import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function testMongo() {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error("MONGO_URI not found in .env");
    }

    console.log("Connecting to MongoDB...");

    await mongoose.connect(uri);

    console.log("MongoDB connection successful!");

    await mongoose.disconnect();

    process.exit(0);

  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}

testMongo();