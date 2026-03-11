import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";

import { db } from "./config/firebase";
import { connectMongo, isMongoAvailable } from "./config/mongo";

import {
  recoverFirebase,
  resetPrimary,
  isUsingBackup,
  processRetryQueue,
  recoverMongo
} from "./services/databaseService";

import listRoutes from "./routes/list";
import taskRoutes from "./routes/task";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectMongo();

app.use("/api/lists", listRoutes);
app.use("/api/tasks", taskRoutes);

//test route

app.get("/", (req: Request, res: Response) => {
  res.send("FERN Stack Backend is Running!");
});


//db status

app.get("/db-status", (req: Request, res: Response) => {

  res.json({
    firebasePrimary: !isUsingBackup(),
    mongodbAvailable: isMongoAvailable()
  });

});

//failover
setInterval(async () => {

  try {

    await db.collection("tasks").limit(1).get();

    resetPrimary();
    recoverFirebase();
    await recoverMongo();
    await processRetryQueue();

  } catch {

    console.log("Firebase still down → using MongoDB backup");

  }

}, 30000);


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

//start server

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});