import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import { db } from "./config/firebase";
import { connectMongo } from "./config/mongo";
import { recoverFirebase } from "./services/databaseService";
import listRoutes from "./routes/list";
import taskRoutes from "./routes/task";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
connectMongo();

console.log("Mongo URI:", process.env.MONGO_URI);

app.use("/api/lists", listRoutes);
app.use("/api/tasks", taskRoutes);


// Basic test route
app.get("/", (req: Request, res: Response) => {
  res.send("FERN Stack Backend is Running!");
});

setInterval(recoverFirebase, 15000);

// Firebase test route
app.get("/firebase-test", async (req: Request, res: Response) => {
  try {
    const docRef = await db.collection("test").add({
      message: "Firebase connected successfully",
      createdAt: new Date()
    });

    res.json({
      success: true,
      id: docRef.id
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Firebase connection failed"
    });
  }
});

// Start Server

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});