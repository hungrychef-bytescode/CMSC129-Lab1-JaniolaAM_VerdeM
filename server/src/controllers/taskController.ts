import { Request, Response } from "express";
import { db } from "../config/firebase";

const collection = db.collection("tasks");

export const getTasks = async (req: Request, res: Response) => {
    const listId = req.query.list_id as string;
    const showDeleted = req.query.deleted === "true";

    const sort = req.query.sort as string;
    const order = req.query.order === "desc" ? "desc" : "asc";

    try {

        let query: FirebaseFirestore.Query = collection.where("list_id", "==", listId);

        if (!showDeleted) {
            query = query.where("deleted", "==", false);
        }

        if (sort) {
            query = query.orderBy(sort, order);
        }

        const snapshot = await query.get();

        const tasks = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json(tasks);

    } catch (error) {

        console.error("Firestore query error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch tasks"
        });
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
        await collection.doc(id).update({ task });
        
        res.json({
            success: true,
            message: "Task updated"
        });

    } catch (error) {
        res.status(500).json({ success: false });
    }
};


export const updateStatus = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { status } = req.body;

    try {

        await collection.doc(id).update({ status });

        res.json({
            success: true,
            message: "Status updated"
        });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

export const updatePriority = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { priority } = req.body;
    
    try {
        await collection.doc(id).update({ priority });
        
        res.json({
            success: true,
            message: "Priority updated"
        });

    } catch (error) {
        res.status(500).json({ success: false });
    }
};



export const updateDueDate = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { due_date } = req.body;
    
    try {
        await collection.doc(id).update({ due_date });

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({
            success: false
        });
    }
};

export const softDeleteTask = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    
    try {
        await collection.doc(id).update({ deleted: true });

        res.json({
            success: true,
            message: "Task soft deleted"
        });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

export const hardDeleteTask = async (req: Request, res: Response) => {
    const id = req.params.id as string;

    try {
        await collection.doc(id).delete();

        res.json({
            success: true,
            message: "Task permanently deleted"
        });

    } catch (error) {

        res.status(500).json({ success: false });
    }
};

export const restoreTask = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    
    try {
        await collection.doc(id).update({ deleted: false });

        res.json({ 
            success: true,
            message: "Task restored"
        });
    } catch (error) {

        console.error(error);

        res.status(500).json({ success: false });
    }
};