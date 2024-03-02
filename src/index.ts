import express from "express";
import authRouter from "./routes/auth";
import tasksRouter from "./routes/tasks";
import validationToken from "./utils/validationToken";

const app = express();
const PORT = 5000;

app.use(express.json());

app.use("/auth", authRouter);
app.use("/tasks", validationToken, tasksRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});