import { Request, Response } from "express";
import { db } from "../config/firebase";

const collection = db.collection("lists");

//get all lists

export const getLists = async (req: Request, res: Response) => {
    try {
        const snapshot = await collection.get();
    
        const lists = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json(lists);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch lists"
        });
    }
};

//create list

export const createList = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        
        const docRef = await collection.add({
            name,
            createdAt: new Date()
        });
        
        res.json({
            success: true,
            id: docRef.id
        });
    
    } catch (error) {
        res.status(500).json({
        success: false,
        message: "Failed to create list"
        });
    }
};

/* DELETE list */

export const deleteList = async (req: Request, res: Response) => {

  const id = req.params.id as string;

  try {
    await collection.doc(id).delete();
    res.json({
        success: true,
        message: "List deleted"
    });

    } catch (error) {
        res.status(500).json({
            success: false
        });
    }
};