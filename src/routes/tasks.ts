import express from "express";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateStatusById,
  updateTaskById,
} from "../controller/tasks";

const router = express.Router();

router.post("/create", createTask);
router.get("/", getTasks);
router.get("/:id", getTaskById);
router.delete("/delete/:id", deleteTask);
router.put("/update/:id", updateTaskById);
router.put("/update-status/:id", updateStatusById);

export default router;
