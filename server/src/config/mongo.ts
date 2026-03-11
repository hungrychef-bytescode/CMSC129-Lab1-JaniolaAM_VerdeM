import mongoose from "mongoose";

let mongoAvailable = false;

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

    mongoAvailable = true;
    console.log("MongoDB backup connected");

  } catch (error) {
    mongoAvailable = false;
    console.error("backup disabled. MongoDB connection failed:", error);
  }
};

export const isMongoAvailable = () => mongoAvailable;