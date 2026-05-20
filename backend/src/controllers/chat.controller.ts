import { Request, Response } from "express";
import { ChatMessage } from "../models/chatMessage.model";
import { getIo } from "../socket";
import { createActionLog } from "../services/log.service";

function getRequestUserId(req: Request) {
    return req.authUser?.userId ?? null;
}

export const getChatMessages = async (req: Request, res: Response) => {
    try {
        const roomId = (req.query.roomId as string) || "global";
        const limit = Number(req.query.limit) || 50;

        const messages = await ChatMessage.find({ roomId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

        const formattedMessages = messages
            .reverse()
            .map((message) => ({
                id: message._id.toString(),
                roomId: message.roomId,
                userId: message.userId,
                userName: message.userName,
                message: message.message,
                createdAt: message.createdAt,
            }));

        return res.json(formattedMessages);
    } catch (error) {
        return res.status(500).json({
            message: "Failed to get chat messages.",
            error,
        });
    }
};

export const deleteChatMessages = async (req: Request, res: Response) => {
    try {
        const roomId = (req.query.roomId as string) || "global";

        await ChatMessage.deleteMany({
            roomId,
        });

        const requestUserId = getRequestUserId(req);

        await createActionLog({
            userId: requestUserId,
            action: "CHAT_CLEARED",
            entityType: "ChatMessage",
            entityId: roomId,
            information: `Cleared chat messages from room ${roomId}.`,
            ipAddress: req.ip,
        });

        getIo().emit("chat:cleared", {
            roomId,
        });

        return res.json({
            message: "Chat messages deleted successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to delete chat messages.",
            error,
        });
    }
};