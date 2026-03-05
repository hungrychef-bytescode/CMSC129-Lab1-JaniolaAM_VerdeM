import mongoose from "mongoose";

export const connectMongo = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error("MONGO_URI is not defined in .env");
    }

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      family: 4,
    });

    console.log("MongoDB backup connected");

  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
};