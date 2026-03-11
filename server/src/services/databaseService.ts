import { db } from "../config/firebase";
import { isMongoAvailable } from "../config/mongo";
import { ListBackup } from "../models/ListBackup";
import { TaskBackup } from "../models/TaskBackup";

let useBackup = false;

//primary db

export const runPrimary = async <T>(operation: () => Promise<T>): Promise<T> => {

  if (useBackup) {
    throw new Error("Primary DB disabled");
  }

  try {

    return await operation();
  } catch (error) {

    console.log("Firebase failed → switching to Mongo backup");

    useBackup = true;

    throw error;

  }

};

export const resetPrimary = () => {

  useBackup = false;

  console.log("Firebase restored → using primary DB");

};

export const isUsingBackup = () => useBackup;

//mongo retry

type Operation = () => Promise<any>;

const retryQueue: Operation[] = [];

export const addRetry = (operation: Operation) => {

  retryQueue.push(operation);

};

export const processRetryQueue = async () => {

  if (!isMongoAvailable()) return;

  if (retryQueue.length === 0) return;

  console.log("Processing Mongo retry queue");

  const remaining: Operation[] = [];

  for (const op of retryQueue) {

    try {

      await op();

    } catch {

      remaining.push(op);

    }

  }

  retryQueue.length = 0;

  retryQueue.push(...remaining);

};

//mongodb

export const runMongo = async <T>(operation: () => Promise<T>): Promise<T | null> => {

  if (!isMongoAvailable()) {

    console.log("Mongo unavailable → queued");

    addRetry(operation);

    return null;

  }

  try {

    console.log("Running Mongo backup");

    return await operation();

  } catch (error) {

    console.error("Mongo write failed:", error);

    addRetry(operation);

    return null;

  }

};

//helper function for write
export const writePrimary = async (
  firebaseOperation: () => Promise<any>,
  mongoOperation: () => Promise<any>
) => {

  try {

    const result = await runPrimary(firebaseOperation);

    await runMongo(mongoOperation);

    return result;

  } catch {

    return await runMongo(mongoOperation);

  }

};

//for update

export const updatePrimary = async (
  firebaseOperation: () => Promise<any>,
  mongoOperation: () => Promise<any>
) => {

  try {

    await runPrimary(firebaseOperation);

    await runMongo(mongoOperation);

  } catch {

    await runMongo(mongoOperation);

  }

};

//for delete

export const deletePrimary = async (
  firebaseOperation: () => Promise<any>,
  mongoOperation: () => Promise<any>
) => {

  try {

    await runPrimary(firebaseOperation);

    await runMongo(mongoOperation);

  } catch {

    await runMongo(mongoOperation);

  }

};

//recover firebase

export const recoverFirebase = async () => {

  if (!isMongoAvailable()) return;

  try {

    console.log("Starting Firebase recovery from MongoDB backup");

    const lists = await ListBackup.find();
    const listIds = new Set(lists.map(l => l.firebaseId));

    // remove lists not in Mongo
    const firebaseLists = await db.collection("lists").get();
    for (const doc of firebaseLists.docs) {

      if (!listIds.has(doc.id)) {
        console.log("Deleting list not found in Mongo:", doc.id);
        await db.collection("lists").doc(doc.id).delete();
      }

    }

    // restore lists
    for (const list of lists) {

      if (!list.firebaseId) continue;

      await db.collection("lists")
        .doc(list.firebaseId)
        .set({
          name: list.name,
          createdAt: list.createdAt
        });

    }

    console.log("Lists restored to Firebase");

    const tasks = await TaskBackup.find();
    const taskIds = new Set(tasks.map(t => t.firebaseId));

    // remove tasks not in Mongo
    const firebaseTasks = await db.collection("tasks").get();
    for (const doc of firebaseTasks.docs) {

      if (!taskIds.has(doc.id)) {
        console.log("Deleting task not found in Mongo:", doc.id);
        await db.collection("tasks").doc(doc.id).delete();
      }

    }

    // restore tasks
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

    console.log("Tasks restored to Firebase");
    console.log("Firebase recovery complete");

  } catch (error) {

    console.error("Firebase recovery failed:", error);

  }

};

export const recoverMongo = async () => {

  if (!isMongoAvailable()) return;

  try {

    console.log("Starting MongoDB recovery from Firebase");

    const listsSnapshot = await db.collection("lists").get();
    const firebaseListIds = new Set(listsSnapshot.docs.map(d => d.id));

    // remove Mongo lists not in Firebase
    await ListBackup.deleteMany({
      firebaseId: { $nin: [...firebaseListIds] }
    });

    for (const doc of listsSnapshot.docs) {

      const data = doc.data();

      await ListBackup.updateOne(
        { firebaseId: doc.id },
        {
          firebaseId: doc.id,
          name: data.name,
          createdAt: data.createdAt
        },
        { upsert: true }
      );

    }

    console.log("Lists restored to MongoDB");

    const tasksSnapshot = await db.collection("tasks").get();
    const firebaseTaskIds = new Set(tasksSnapshot.docs.map(d => d.id));

    // remove Mongo tasks not in Firebase
    await TaskBackup.deleteMany({
      firebaseId: { $nin: [...firebaseTaskIds] }
    });

    for (const doc of tasksSnapshot.docs) {

      const data = doc.data();

      await TaskBackup.updateOne(
        { firebaseId: doc.id },
        {
          firebaseId: doc.id,
          task: data.task,
          priority: data.priority,
          due_date: data.due_date,
          list_id: data.list_id,
          status: data.status,
          deleted: data.deleted,
          createdAt: data.createdAt
        },
        { upsert: true }
      );

    }

    console.log("Tasks restored to MongoDB");

  } catch (error) {

    console.error("MongoDB recovery failed:", error);

  }

};