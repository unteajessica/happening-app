import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { ChatMessage } from "./models/chatMessage.model";
import { createActionLog } from "./services/log.service";
import { analyzeUserForSuspiciousBehavior } from "./services/suspicious.service";
import { verifyAuthToken } from "./utils/authToken";
import { prisma } from "./db/prisma";

let io: Server | null = null;

type SendChatMessagePayload = {
    roomId?: string;
    message: string;
};

export function initSocket(server: HttpServer) {
    io = new Server(server, {
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

            const authUser = verifyAuthToken(token);

            socket.data.authUser = authUser;

            return next();
        } catch {
            return next(new Error("Invalid or expired token."));
        }
    });

    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);

        socket.on("chat:send-message", async (payload: SendChatMessagePayload) => {
            try {
                const authUser = socket.data.authUser;

                if (!authUser) {
                    socket.emit("chat:error", {
                        message: "Authenticated user is required.",
                    });
                    return;
                }

                const user = await prisma.user.findUnique({
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

                const savedMessage = await ChatMessage.create({
                    roomId,
                    userId: user.id,
                    userName: user.name,
                    message: trimmedMessage,
                });

                await createActionLog({
                    userId: user.id,
                    action: "CHAT_MESSAGE_SENT",
                    entityType: "ChatMessage",
                    entityId: savedMessage._id.toString(),
                    information: `User ${user.name} sent a chat message in room ${roomId}.`,
                });

                await analyzeUserForSuspiciousBehavior(user.id);

                const messageToSend = {
                    id: savedMessage._id.toString(),
                    roomId: savedMessage.roomId,
                    userId: savedMessage.userId,
                    userName: savedMessage.userName,
                    message: savedMessage.message,
                    createdAt: savedMessage.createdAt,
                };

                io?.emit("chat:new-message", messageToSend);
            } catch (error) {
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

export function getIo() {
    if (!io) {
        throw new Error("Socket.io is not initialized.");
    }

    return io;
}