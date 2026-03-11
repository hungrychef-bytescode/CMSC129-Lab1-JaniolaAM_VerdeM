import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    firebaseId: String,
    task: String,
    priority: String,
    due_date: String,
    list_id: String,
    status: Number,
    deleted: Boolean,
    createdAt: Date
});

export const TaskBackup = mongoose.model("TaskBackup", TaskSchema);