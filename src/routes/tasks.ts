import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import validationToken from "../utils/validationToken";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/create", async (req: Request, res: Response) => {
  const { title, description, due_date } = req.body;
  const userId = (req as any).payload?.user_id;

  if (!title || !description || !due_date) {
    return res.status(400).json({
      message: "Please provide title, description, and due_date",
    });
  }

  try {
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 7);
    const formattedDate = currentDate
      .toISOString()
      .slice(0, 16)
      .replace("T", " ");

    const task = await prisma.tasks.create({
      data: {
        user_id: userId,
        title,
        description,
        due_date,
        status: "in_progress",
        created_at: formattedDate,
        updated_at: formattedDate,
      },
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.get("/", async (req: Request, res: Response) => {
  const userId = (req as any).payload?.user_id;

  try {
    const tasks = await prisma.tasks.findMany({
      where: {
        user_id: userId,
      },
    });

    res.status(200).json({
      message: "Tasks retrieved successfully",
      data: {
        tasks,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.delete("/delete/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: "Please provide task_id",
    });
  }

  try {
    const task = await prisma.tasks.delete({
      where: {
        task_id: Number(id),
      },
    });
    res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.put("/update/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: "Please provide task_id",
    });
  }

  const { title, description, due_date } = req.body;

  try {
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 7);
    const formattedDate = currentDate
      .toISOString()
      .slice(0, 16)
      .replace("T", " ");
    const task = await prisma.tasks.update({
      where: {
        task_id: Number(id),
      },
      data: {
        title,
        description,
        due_date,
        updated_at: formattedDate,
      },
    });

    res.json({
      message: "Task updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

export default router;
