"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.createComment = exports.getCommentsByEventId = void 0;
const prisma_1 = require("../db/prisma");
const comment_validator_1 = require("../validators/comment.validator");
const log_service_1 = require("../services/log.service");
const suspicious_service_1 = require("../services/suspicious.service");
function formatComment(comment) {
    return {
        id: comment.id,
        eventId: comment.eventId,
        author: comment.user.name,
        message: comment.content,
        createdAt: comment.createdAt.toISOString(),
    };
}
function getRequestUserId(req) {
    return req.authUser?.userId ?? null;
}
const getCommentsByEventId = async (req, res) => {
    try {
        const eventId = Number(req.params.eventId);
        const eventExists = await prisma_1.prisma.event.findUnique({
            where: { id: eventId },
        });
        if (!eventExists) {
            return res.status(404).json({ message: "Event not found." });
        }
        const eventComments = await prisma_1.prisma.comment.findMany({
            where: {
                eventId,
            },
            include: {
                user: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return res.json(eventComments.map(formatComment));
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to get comments.",
            error,
        });
    }
};
exports.getCommentsByEventId = getCommentsByEventId;
const createComment = async (req, res) => {
    try {
        const requestUserId = getRequestUserId(req);
        if (!requestUserId) {
            return res.status(401).json({
                message: "Authenticated user is required.",
            });
        }
        const commentData = req.body;
        const validationErrors = (0, comment_validator_1.validateCommentInput)(commentData);
        if (Object.keys(validationErrors).length > 0) {
            return res.status(400).json({ validationErrors });
        }
        const eventExists = await prisma_1.prisma.event.findUnique({
            where: {
                id: Number(commentData.eventId),
            },
        });
        if (!eventExists) {
            return res.status(404).json({ message: "Event not found." });
        }
        const newComment = await prisma_1.prisma.comment.create({
            data: {
                eventId: Number(commentData.eventId),
                userId: requestUserId,
                content: commentData.message.trim(),
            },
            include: {
                user: true,
            },
        });
        await (0, log_service_1.createActionLog)({
            userId: requestUserId,
            action: "COMMENT_CREATED",
            entityType: "Comment",
            entityId: newComment.id,
            information: `Created comment for event ${newComment.eventId}.`,
            ipAddress: req.ip,
        });
        return res.status(201).json(formatComment(newComment));
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to create comment.",
            error,
        });
    }
};
exports.createComment = createComment;
const deleteComment = async (req, res) => {
    try {
        const commentId = Number(req.params.commentId);
        const commentExists = await prisma_1.prisma.comment.findUnique({
            where: {
                id: commentId,
            },
        });
        if (!commentExists) {
            return res.status(404).json({ message: "Comment not found." });
        }
        await prisma_1.prisma.comment.delete({
            where: {
                id: commentId,
            },
        });
        const requestUserId = getRequestUserId(req);
        await (0, log_service_1.createActionLog)({
            userId: requestUserId,
            action: "COMMENT_DELETED",
            entityType: "Comment",
            entityId: commentId,
            information: `Deleted comment ${commentId}.`,
            ipAddress: req.ip,
        });
        if (requestUserId) {
            await (0, suspicious_service_1.analyzeUserForSuspiciousBehavior)(requestUserId);
        }
        return res.json({ message: "Comment deleted successfully." });
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to delete comment.",
            error,
        });
    }
};
exports.deleteComment = deleteComment;
