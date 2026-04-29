import express from "express";
import cors from "cors";
import eventsRoutes from "./routes/events.routes";
import statsRoutes from "./routes/stats.routes";
import generatorRoutes from "./routes/generator.routes";
import commentsRoutes from "./routes/comments.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/events", eventsRoutes);
app.use("/stats", statsRoutes);
app.use("/generator", generatorRoutes);
app.use("/comments", commentsRoutes);

export default app;