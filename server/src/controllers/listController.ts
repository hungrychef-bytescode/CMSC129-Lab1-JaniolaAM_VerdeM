import { Request, Response } from "express";
import { db } from "../config/firebase";
import { ListBackup } from "../models/ListBackup";
import { runPrimary } from "../services/databaseService";

const collection = db.collection("lists");

//get all lists

export const getLists = async (req: Request, res: Response) => {
    try {
        const snapshot = await runPrimary(() => collection.get());

        const lists = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json(lists);
    } catch (error) {
        
        const lists = await ListBackup.find();
        res.json(lists);
    }
};

//create list

export const createList = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        
        const docRef = await runPrimary(() => collection.add({
            name,
            createdAt: new Date()
        }));
        
        await ListBackup.create({
            firebaseId: docRef.id,
            name,
            createdAt: new Date()
        });

        res.json({
            success: true,
            id: docRef.id
        });
    
    } catch (error) {
        
        const backup = await ListBackup.create({
            name: req.body.name,
            createdAt: new Date()
        });

        res.json({
            success: true,
            id: backup._id
        });
    }
};

//delete list

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