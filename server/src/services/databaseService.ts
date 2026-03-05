import { db } from "../config/firebase";
import { TaskBackup } from "../models/TaskBackup";

export const recoverFirebase = async () => {

    try {
        const tasks = await TaskBackup.find();
        for (const task of tasks) {
            if (!task.firebaseId) continue;
            await db.collection("tasks")
                .doc(task.firebaseId)
                .set({
                task: task.task,
                priority: task.priority,
                due_date: task.due_date,
                list_id: task.list_id,
                status: task.status,
                deleted: task.deleted,
                createdAt: task.createdAt
            });
        }
        console.log("firebase recovery complete");
    } catch {
        console.log("Firebase still unavailable");
    }
};

let useBackup = false;

export const runPrimary = async <T>(operation: () => Promise<T>): Promise<T> => {

  if (useBackup) {
    throw new Error("Primary database disabled");
  }

  try {
    return await operation();

  } catch (error) {
    console.log("Firebase failed. Switching to MongoDB backup");
    useBackup = true;
    throw error;
  }

};