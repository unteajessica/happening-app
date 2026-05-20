import express from "express";
import cors from "cors";
import eventsRoutes from "./routes/events.routes";
import statsRoutes from "./routes/stats.routes";
import generatorRoutes from "./routes/generator.routes";
import commentsRoutes from "./routes/comments.routes";
import categoriesRoutes from "./routes/categories.routes";
import authRoutes from "./routes/auth.routes";
import chatRoutes from "./routes/chat.routes";
import logsRoutes from "./routes/logs.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/events", eventsRoutes);
app.use("/stats", statsRoutes);
app.use("/generator", generatorRoutes);
app.use("/comments", commentsRoutes);
app.use("/categories", categoriesRoutes);
app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);
app.use("/logs", logsRoutes);

export default app;