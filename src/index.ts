import express from "express";
import authRouter from "./routes/auth";
import tasksRouter from "./routes/tasks";
import validationToken from "./utils/validationToken";
import { updateTaskStatus } from "./utils/cronJobs";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";

const app = express();
const PORT = 5000;

updateTaskStatus();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/auth", authRouter);
app.use("/tasks", validationToken, tasksRouter); 

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
