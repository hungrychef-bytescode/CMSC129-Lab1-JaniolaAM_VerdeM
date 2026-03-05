import mongoose from "mongoose";

const ListSchema = new mongoose.Schema({
    firebaseId: String,
    name: String,
    createdAt: Date
});

export const ListBackup = mongoose.model("ListBackup", ListSchema);