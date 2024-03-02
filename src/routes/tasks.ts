import express from "express";
import {
  createTask,
  deleteTask,
  getTasks,
  updateStatusById,
  updateTaskById,
} from "../controller/tasks";

const router = express.Router();

router.post("/create", createTask);
router.get("/", getTasks);
router.delete("/delete/:id", deleteTask);
router.put("/update/:id", updateTaskById);
router.put("/update-status/:id", updateStatusById);

export default router;
