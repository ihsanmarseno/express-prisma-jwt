import express from "express";
import authRouter from "./routes/auth";
import tasksRouter from "./routes/tasks";
import validationToken from "./utils/validationToken";
import { updateTaskStatus } from "./utils/cronJobs";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";

const app = express();
const PORT = 5000;
const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui.min.css";

updateTaskStatus();

app.use(express.json());

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customCss:
      ".swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }",
    customCssUrl: CSS_URL,
  })
);

app.use("/auth", authRouter);
app.use("/tasks", validationToken, tasksRouter);

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
