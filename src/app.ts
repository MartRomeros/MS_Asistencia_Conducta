import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import docentesRouter from "./routes/docentes.routes";
import cursosRouter from "./routes/cursos.routes";
import asistenciaRouter from "./routes/asistencia.routes";
import anotacionesRouter from "./routes/anotaciones.routes";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/docentes", docentesRouter);
app.use("/api/cursos", cursosRouter);
app.use("/api/asistencia", asistenciaRouter);
app.use("/api/anotaciones", anotacionesRouter);

app.get("/health", (req, res) => {
  res.json({ status: "UP" });
});

// Error handling
app.use(errorMiddleware);

export default app;
