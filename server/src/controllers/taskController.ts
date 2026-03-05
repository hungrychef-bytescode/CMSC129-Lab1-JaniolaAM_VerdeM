import { Request, Response } from "express";
import { db } from "../config/firebase";
import { TaskBackup } from "../models/TaskBackup";
import { runPrimary } from "../services/databaseService";

const collection = db.collection("tasks");

export const getTasks = async (req: Request, res: Response) => {
    const listId = req.query.list_id as string;
    const showDeleted = req.query.deleted === "true";

    const sort = req.query.sort as string;
    const order = req.query.order === "desc" ? "desc" : "asc";

    try {
        const snapshot = await runPrimary(async () => {
            let query: FirebaseFirestore.Query = collection.where("list_id", "==", listId);

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

    } catch (error) {

        console.log("firebase failed. MongoDB backup");

        let query: any = { list_id: listId };

        if (!showDeleted) {
            query.deleted = false;
        }

        let tasksQuery = TaskBackup.find(query);

        if (sort) {
            tasksQuery = tasksQuery.sort({
            [sort]: order === "asc" ? 1 : -1});
        }

        const tasks = await tasksQuery;

        res.json(tasks);
    }
};

export const createTask = async (req: Request, res: Response) => {
    try {
        const { task, priority, due_date, list_id } = req.body;
        const docRef = await collection.add({
            task,
            priority,
            due_date,
            list_id,
            status: 0,
            deleted: false,
            createdAt: new Date()
        });

        res.json({
            success: true,
            id: docRef.id
        });

    } catch (error) {

        res.status(500).json({ success: false });
    }
};

export const updateTask = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { task } = req.body;
    
    try {
        await runPrimary(() => collection.doc(id).update({ task }) );


        await TaskBackup.updateOne(
            { firebaseId: id },
            { task }
        );

        res.json({
            success: true,
            message: "Task updated"
        });
    } catch (error) {

        console.log("firebase failed. updating MongoDB backup");

        await TaskBackup.updateOne(
            { firebaseId: id },
            { task }
        );

        res.json({
            success: true,
            message: "Task updated in backup database"
        });
    }
};

export const updateStatus = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { status } = req.body;
    
    try {
        await runPrimary(() => collection.doc(id).update({ status }) );


        await TaskBackup.updateOne(
            { firebaseId: id },
            { status }
        );

        res.json({
            success: true,
            message: "status updated"
        });
    } catch (error) {

        console.log("firebase failed. updating MongoDB backup");

        await TaskBackup.updateOne(
            { firebaseId: id },
            { status }
        );

        res.json({
            success: true,
            message: "Status updated in backup database"
        });
    }
};

export const updatePriority = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { priority } = req.body;
    
    try {
        await runPrimary(() => collection.doc(id).update({ priority }) );


        await TaskBackup.updateOne(
            { firebaseId: id },
            { priority }
        );

        res.json({
            success: true,
            message: "priority updated"
        });
    } catch (error) {

        console.log("firebase failed. updating MongoDB backup");

        await TaskBackup.updateOne(
            { firebaseId: id },
            { priority }
        );

        res.json({
            success: true,
            message: "Priority updated in backup database"
        });
    }
};

export const updateDueDate = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { due_date } = req.body;
    
    try {
        await runPrimary(() => collection.doc(id).update({ due_date }) );


        await TaskBackup.updateOne(
            { firebaseId: id },
            { due_date }
        );

        res.json({
            success: true,
            message: "Due Date updated"
        });
    } catch (error) {

        console.log("firebase failed. updating MongoDB backup");

        await TaskBackup.updateOne(
            { firebaseId: id },
            { due_date }
        );

        res.json({
            success: true,
            message: "Due Date updated in backup database"
        });
    }
};

export const softDeleteTask = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    
    try {
        await runPrimary(() => collection.doc(id).update({ deleted: true }));
        
        await TaskBackup.updateOne(
            { firebaseId: id },
            { deleted: true }
        );

        res.json({
            success: true,
            message: "Task soft deleted"
        });

    } catch (error) {

        console.log("firebase failed, updating MongoDB backup");
        
        await TaskBackup.updateOne(
            { firebaseId: id },
            { deleted: true }
        );

        res.json({
            success: true,
            message: "Task soft deleted in backup database"
        });
    }
};

export const hardDeleteTask = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    try { 
        await runPrimary(() => collection.doc(id).delete());
        
        await TaskBackup.deleteOne({ firebaseId: id });

        res.json({
            success: true,
            message: "Task permanently deleted"
        });
    } catch (error) {

        console.log("firebase failed, deleting from MongoDB backup");
        
        await TaskBackup.deleteOne({ firebaseId: id });

        res.json({
            success: true,
            message: "Task deleted from backup database"
        });
    }
};

export const restoreTask = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    
    try {
        await runPrimary(() => collection.doc(id).update({ deleted: false }) );
        
        await TaskBackup.updateOne(
            { firebaseId: id },
            { deleted: false }
        );

        res.json({
            success: true,
            message: "Task restored"
        });
    } catch (error) {

        console.log("firebase failed. restoring from MongoDB backup");

        await TaskBackup.updateOne(
            { firebaseId: id },
            { deleted: false }
        );

        res.json({
            success: true,
            message: "Task restored in backup database"
        });
    }
};