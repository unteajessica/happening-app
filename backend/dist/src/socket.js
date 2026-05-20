"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = initSocket;
exports.getIo = getIo;
const socket_io_1 = require("socket.io");
const chatMessage_model_1 = require("./models/chatMessage.model");
const log_service_1 = require("./services/log.service");
const suspicious_service_1 = require("./services/suspicious.service");
const authToken_1 = require("./utils/authToken");
const prisma_1 = require("./db/prisma");
let io = null;
function initSocket(server) {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token;
            if (!token || typeof token !== "string") {
                return next(new Error("Authentication token is required."));
            }
            const authUser = (0, authToken_1.verifyAuthToken)(token);
            socket.data.authUser = authUser;
            return next();
        }
        catch {
            return next(new Error("Invalid or expired token."));
        }
    });
    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);
        socket.on("chat:send-message", async (payload) => {
            try {
                const authUser = socket.data.authUser;
                if (!authUser) {
                    socket.emit("chat:error", {
                        message: "Authenticated user is required.",
                    });
                    return;
                }
                const user = await prisma_1.prisma.user.findUnique({
                    where: {
                        id: authUser.userId,
                    },
                });
                if (!user) {
                    socket.emit("chat:error", {
                        message: "User not found.",
                    });
                    return;
                }
                const roomId = payload.roomId || "global";
                const trimmedMessage = payload.message.trim();
                if (!trimmedMessage) {
                    socket.emit("chat:error", {
                        message: "Invalid chat message.",
                    });
                    return;
                }
                const savedMessage = await chatMessage_model_1.ChatMessage.create({
                    roomId,
                    userId: user.id,
                    userName: user.name,
                    message: trimmedMessage,
                });
                await (0, log_service_1.createActionLog)({
                    userId: user.id,
                    action: "CHAT_MESSAGE_SENT",
                    entityType: "ChatMessage",
                    entityId: savedMessage._id.toString(),
                    information: `User ${user.name} sent a chat message in room ${roomId}.`,
                });
                await (0, suspicious_service_1.analyzeUserForSuspiciousBehavior)(user.id);
                const messageToSend = {
                    id: savedMessage._id.toString(),
                    roomId: savedMessage.roomId,
                    userId: savedMessage.userId,
                    userName: savedMessage.userName,
                    message: savedMessage.message,
                    createdAt: savedMessage.createdAt,
                };
                io?.emit("chat:new-message", messageToSend);
            }
            catch (error) {
                console.error("Failed to send chat message:", error);
                socket.emit("chat:error", {
                    message: "Failed to send chat message.",
                });
            }
        });
        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });
    return io;
}
function getIo() {
    if (!io) {
        throw new Error("Socket.io is not initialized.");
    }
    return io;
}
