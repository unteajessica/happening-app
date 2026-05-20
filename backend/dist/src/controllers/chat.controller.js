"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteChatMessages = exports.getChatMessages = void 0;
const chatMessage_model_1 = require("../models/chatMessage.model");
const socket_1 = require("../socket");
const log_service_1 = require("../services/log.service");
function getRequestUserId(req) {
    return req.authUser?.userId ?? null;
}
const getChatMessages = async (req, res) => {
    try {
        const roomId = req.query.roomId || "global";
        const limit = Number(req.query.limit) || 50;
        const messages = await chatMessage_model_1.ChatMessage.find({ roomId })
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
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to get chat messages.",
            error,
        });
    }
};
exports.getChatMessages = getChatMessages;
const deleteChatMessages = async (req, res) => {
    try {
        const roomId = req.query.roomId || "global";
        await chatMessage_model_1.ChatMessage.deleteMany({
            roomId,
        });
        const requestUserId = getRequestUserId(req);
        await (0, log_service_1.createActionLog)({
            userId: requestUserId,
            action: "CHAT_CLEARED",
            entityType: "ChatMessage",
            entityId: roomId,
            information: `Cleared chat messages from room ${roomId}.`,
            ipAddress: req.ip,
        });
        (0, socket_1.getIo)().emit("chat:cleared", {
            roomId,
        });
        return res.json({
            message: "Chat messages deleted successfully.",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to delete chat messages.",
            error,
        });
    }
};
exports.deleteChatMessages = deleteChatMessages;
