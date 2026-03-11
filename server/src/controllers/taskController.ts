import { Request, Response } from "express";
import { db } from "../config/firebase";
import { TaskBackup } from "../models/TaskBackup";
import {
  runPrimary,
  writePrimary,
  updatePrimary,
  deletePrimary
} from "../services/databaseService";

const collection = db.collection("tasks");

//get task
export const getTasks = async (req: Request, res: Response) => {

  const listId = req.query.list_id as string;
  const showDeleted = req.query.deleted === "true";

  const sort = req.query.sort as string;
  const order = req.query.order === "desc" ? "desc" : "asc";

  try {

    const snapshot = await runPrimary(async () => {

      let query: FirebaseFirestore.Query =
        collection.where("list_id", "==", listId);

      if (!showDeleted) {
        query = query.where("deleted", "==", false);
      }

      if (sort) {
        query = query.orderBy(sort, order);
      }

      return await query.get();

    });

    const tasks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(tasks);

  } catch {

    console.log("Firebase failed → using MongoDB backup");

    let query: any = { list_id: listId };

    if (!showDeleted) query.deleted = false;

    let tasksQuery = TaskBackup.find(query);

    if (sort) {
      tasksQuery = tasksQuery.sort({
        [sort]: order === "asc" ? 1 : -1
      });
    }

    const tasks = await tasksQuery;

    res.json(tasks);

  }

};

//create task

export const createTask = async (req: Request, res: Response) => {

  const { task, priority, due_date, list_id } = req.body;

  const docRef = collection.doc();

  const data = {
    task,
    priority,
    due_date,
    list_id,
    status: 0,
    deleted: false,
    createdAt: new Date()
  };

  try {

    await writePrimary(

      () => docRef.set(data),

      () => TaskBackup.create({
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
      success: false
    });

  }

};

//update task

export const updateTask = async (req: Request, res: Response) => {

  const id = req.params.id as string;
  const { task } = req.body;

  await updatePrimary(

    () => collection.doc(id).update({ task }),

    () => TaskBackup.updateOne({ firebaseId: id }, { task }, { upsert: true })

  );

  res.json({
    success: true,
    message: "Task updated"
  });

};

//update status

export const updateStatus = async (req: Request, res: Response) => {

  const id = req.params.id as string;
  const { status } = req.body;

  await updatePrimary(

    () => collection.doc(id).update({ status }),

    () => TaskBackup.updateOne({ firebaseId: id }, { status }, { upsert: true })

  );

  res.json({
    success: true,
    message: "Status updated"
  });

};

// update priority

export const updatePriority = async (req: Request, res: Response) => {

  const id = req.params.id as string;
  const { priority } = req.body;

  await updatePrimary(

    () => collection.doc(id).update({ priority }),

    () => TaskBackup.updateOne({ firebaseId: id }, { priority }, { upsert: true })

  );

  res.json({
    success: true,
    message: "Priority updated"
  });

};

//update due date

export const updateDueDate = async (req: Request, res: Response) => {

  const id = req.params.id as string;
  const { due_date } = req.body;

  await updatePrimary(

    () => collection.doc(id).update({ due_date }),

    () => TaskBackup.updateOne({ firebaseId: id }, { due_date }, { upsert: true })

  );

  res.json({
    success: true,
    message: "Due date updated"
  });

};

//soft delete

export const softDeleteTask = async (req: Request, res: Response) => {

  const id = req.params.id as string;

  await updatePrimary(

    () => collection.doc(id).update({ deleted: true }),

    () => TaskBackup.updateOne({ firebaseId: id }, { deleted: true }, { upsert: true })

  );

  res.json({
    success: true,
    message: "Task soft deleted"
  });

};

//restore task

export const restoreTask = async (req: Request, res: Response) => {

  const id = req.params.id as string;

  await updatePrimary(

    () => collection.doc(id).update({ deleted: false }),

    () => TaskBackup.updateOne({ firebaseId: id }, { deleted: false }, { upsert: true })

  );

  res.json({
    success: true,
    message: "Task restored"
  });

};

//hard delete

export const hardDeleteTask = async (req: Request, res: Response) => {

  const id = req.params.id as string;

  await deletePrimary(

    () => collection.doc(id).delete(),

    () => TaskBackup.deleteOne({ firebaseId: id })

  );

  res.json({
    success: true,
    message: "Task permanently deleted"
  });

};