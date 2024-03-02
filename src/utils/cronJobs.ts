import { PrismaClient } from "@prisma/client";
import { parse } from "date-fns";
import cron from "node-cron";

const prisma = new PrismaClient();

export async function updateTaskStatus() {
  try {
    const tasks = await prisma.tasks.findMany();
    const currentTime = new Date();

    for (const task of tasks) {
      const dueDate = parse(task.due_date, "yyyy-MM-dd HH:mm", new Date());

      if (task.status === "done") {
        continue;
      }

      if (dueDate < currentTime && task.status !== "overdue") {
        await prisma.tasks.update({
          where: { task_id: task.task_id },
          data: { status: "overdue" },
        });
      }
    }
    console.log("Task status updated successfully.");
  } catch (error) {
    console.error("Error updating task status:", error);
  }
}

// Jadwalkan tugas untuk dijalankan setiap jam
cron.schedule(
  "* * * * *",
  async () => {
    await updateTaskStatus();
  },
  {
    scheduled: true,
    timezone: "Asia/Jakarta",
  }
);
