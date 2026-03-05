import { Router } from "express";

import {
  getLists,
  createList,
  deleteList
} from "../controllers/listController";

const router = Router();

router.get("/", getLists);
router.post("/", createList);
router.delete("/:id", deleteList);

export default router;