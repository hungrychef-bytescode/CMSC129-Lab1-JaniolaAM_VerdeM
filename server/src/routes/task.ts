import { Router } from "express";

import {
  getTasks,
  createTask,
  updateTask,
  updateStatus,
  updatePriority,
  updateDueDate,
  softDeleteTask,
  hardDeleteTask,
  restoreTask
} from "../controllers/taskController";

const router = Router();

router.get("/", getTasks);

router.post("/", createTask);

router.put("/:id/task", updateTask);
router.put("/:id/status", updateStatus);
router.put("/:id/priority", updatePriority);
router.put("/:id/due_date", updateDueDate);

router.put("/:id/soft-delete", softDeleteTask);
router.put("/:id/restore", restoreTask); 
router.delete("/:id", hardDeleteTask);

export default router;