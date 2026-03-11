import { Request, Response } from "express";
import { db } from "../config/firebase";
import { ListBackup } from "../models/ListBackup";
import { TaskBackup } from "../models/TaskBackup";
import { runPrimary, runMongo, writePrimary, deletePrimary } from "../services/databaseService";
import { isMongoAvailable } from "../config/mongo";

const collection = db.collection("lists");

//all list

export const getLists = async (req: Request, res: Response) => {

  try {

    const snapshot = await runPrimary(() => collection.get());

    const lists = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(lists);

  } catch {

    console.log("Firebase failed → using MongoDB backup");

    if (!isMongoAvailable()) {
      return res.json([]);
    }

    const lists = await ListBackup.find();

    res.json(lists);

  }

};

export const createList = async (req: Request, res: Response) => {

  const { name } = req.body;

  const docRef = collection.doc();

  const data = {
    name,
    createdAt: new Date()
  };

  try {

    await writePrimary(

      () => docRef.set(data),

      () =>
        ListBackup.create({
          firebaseId: docRef.id,
          ...data
        })

    );

    res.json({
      success: true,
      id: docRef.id
    });

  } catch {

    res.status(500).json({
      success: false,
      message: "Both databases unavailable"
    });

  }

};

//delete list

export const deleteList = async (req: Request, res: Response) => {

  const id = req.params.id as string;

  try {

    await deletePrimary(

      async () => {

  // find tasks under the list
        const tasksSnapshot = await db
            .collection("tasks")
            .where("list_id", "==", id)
            .get();

        const batch = db.batch();

  // delete tasks
        tasksSnapshot.forEach((doc) => {
            batch.delete(doc.ref);
        });

  // delete the list
    batch.delete(collection.doc(id));

    await batch.commit();
    },

     async () => {

        await TaskBackup.deleteMany({ list_id: id });

        await ListBackup.deleteOne({ firebaseId: id });

      }

    );

    res.json({
      success: true,
      message: "List deleted"
    });

  } catch {

    res.status(500).json({
      success: false
    });

  }

};