import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createTask = async (req: Request, res: Response) => {
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
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).payload?.user_id;

  // Mendapatkan informasi tugas dari database berdasarkan user_id
  try {
    const task = await prisma.tasks.findUnique({
      where: {
        task_id: Number(id),
      },
    });

    // Memeriksa apakah tugas ditemukan dan apakah pengguna adalah pemiliknya
    if (!task || task.user_id !== userId) {
      return res.status(403).json({
        message: "You are not authorized to delete this task",
      });
    }

    // Menghapus tugas jika pengguna adalah pemiliknya
    await prisma.tasks.delete({
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
};

export const getTasks = async (req: Request, res: Response) => {
  const userId = (req as any).payload?.user_id;
  const { status } = req.query;

  try {
    let tasks;

    if (status) {
      tasks = await prisma.tasks.findMany({
        where: {
          user_id: userId,
          status: status.toString(),
        },
      });
    } else {
      tasks = await prisma.tasks.findMany({
        where: {
          user_id: userId,
        },
      });
    }

    const tasksWithoutUserId = tasks.map(({ user_id, ...data }) => data);

    res.status(200).json({
      message: "Tasks retrieved successfully",
      data: tasksWithoutUserId,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateTaskById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: "Please provide task_id",
    });
  }

  const { title, description, due_date } = req.body;
  const userId = (req as any).payload?.user_id;

  try {
    const task = await prisma.tasks.findUnique({
      where: {
        task_id: Number(id),
      },
    });

    // Memeriksa apakah tugas ditemukan dan apakah pengguna adalah pemiliknya
    if (!task || task.user_id !== userId) {
      return res.status(403).json({
        message: "You are not authorized to update this task",
      });
    }

    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 7);
    const formattedDate = currentDate
      .toISOString()
      .slice(0, 16)
      .replace("T", " ");
    const updatedTask = await prisma.tasks.update({
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
      updatedTask,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateStatusById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = (req as any).payload?.user_id;

  if (!id || !status) {
    return res.status(400).json({
      message: "Please provide task_id or status",
    });
  }

  try {
    const task = await prisma.tasks.findUnique({
      where: {
        task_id: Number(id),
      },
    });

    // Memeriksa apakah tugas ditemukan dan apakah pengguna adalah pemiliknya
    if (!task || task.user_id !== userId) {
      return res.status(403).json({
        message: "You are not authorized to update the status of this task",
      });
    }

    const updatedTask = await prisma.tasks.update({
      where: {
        task_id: Number(id),
      },
      data: {
        status,
      },
    });

    res.json({
      message: "Task status updated successfully",
      updatedTask,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
