"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const events_routes_1 = __importDefault(require("./routes/events.routes"));
const stats_routes_1 = __importDefault(require("./routes/stats.routes"));
const generator_routes_1 = __importDefault(require("./routes/generator.routes"));
const comments_routes_1 = __importDefault(require("./routes/comments.routes"));
const categories_routes_1 = __importDefault(require("./routes/categories.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const chat_routes_1 = __importDefault(require("./routes/chat.routes"));
const logs_routes_1 = __importDefault(require("./routes/logs.routes"));
const app = (0, express_1.default)();
const allowedOrigins = [
    "https://localhost:5173",
    "http://localhost:5173",
    process.env.FRONTEND_URL,
].filter(Boolean);
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }
        callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
}));
app.use(express_1.default.json());
app.use("/events", events_routes_1.default);
app.use("/stats", stats_routes_1.default);
app.use("/generator", generator_routes_1.default);
app.use("/comments", comments_routes_1.default);
app.use("/categories", categories_routes_1.default);
app.use("/auth", auth_routes_1.default);
app.use("/chat", chat_routes_1.default);
app.use("/logs", logs_routes_1.default);
exports.default = app;
