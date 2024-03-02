import express from "express";
import authRouter from "./routes/auth";
import tasksRouter from "./routes/tasks";
import validationToken from "./utils/validationToken";
import { updateTaskStatus } from "./utils/cronJobs";

const app = express();
const PORT = 5000;

app.use(express.json());
updateTaskStatus();

app.use("/auth", authRouter);
app.use("/tasks", validationToken, tasksRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
