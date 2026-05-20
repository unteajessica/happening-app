import { Request, Response } from "express";
import { prisma } from "../db/prisma";
import type { CommentInput } from "../data/comment";
import { validateCommentInput } from "../validators/comment.validator";
import { createActionLog } from "../services/log.service";
import { analyzeUserForSuspiciousBehavior } from "../services/suspicious.service";

function formatComment(comment: any) {
    return {
        id: comment.id,
        eventId: comment.eventId,
        author: comment.user.name,
        message: comment.content,
        createdAt: comment.createdAt.toISOString(),
    };
}

function getRequestUserId(req: Request) {
    return req.authUser?.userId ?? null;
}

export const getCommentsByEventId = async (req: Request, res: Response) => {
    try {
        const eventId = Number(req.params.eventId);

        const eventExists = await prisma.event.findUnique({
            where: { id: eventId },
        });

        if (!eventExists) {
            return res.status(404).json({ message: "Event not found." });
        }

        const eventComments = await prisma.comment.findMany({
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
    } catch (error) {
        return res.status(500).json({
            message: "Failed to get comments.",
            error,
        });
    }
};

export const createComment = async (req: Request, res: Response) => {
    try {
        const requestUserId = getRequestUserId(req);

        if (!requestUserId) {
            return res.status(401).json({
                message: "Authenticated user is required.",
            });
        }

        const commentData: Partial<CommentInput> = req.body;

        const validationErrors = validateCommentInput(commentData);

        if (Object.keys(validationErrors).length > 0) {
            return res.status(400).json({ validationErrors });
        }

        const eventExists = await prisma.event.findUnique({
            where: {
                id: Number(commentData.eventId),
            },
        });

        if (!eventExists) {
            return res.status(404).json({ message: "Event not found." });
        }

        const newComment = await prisma.comment.create({
            data: {
                eventId: Number(commentData.eventId),
                userId: requestUserId,
                content: commentData.message!.trim(),
            },
            include: {
                user: true,
            },
        });

        await createActionLog({
            userId: requestUserId,
            action: "COMMENT_CREATED",
            entityType: "Comment",
            entityId: newComment.id,
            information: `Created comment for event ${newComment.eventId}.`,
            ipAddress: req.ip,
        });

        return res.status(201).json(formatComment(newComment));
    } catch (error) {
        return res.status(500).json({
            message: "Failed to create comment.",
            error,
        });
    }
};

export const deleteComment = async (req: Request, res: Response) => {
    try {
        const commentId = Number(req.params.commentId);

        const commentExists = await prisma.comment.findUnique({
            where: {
                id: commentId,
            },
        });

        if (!commentExists) {
            return res.status(404).json({ message: "Comment not found." });
        }

        await prisma.comment.delete({
            where: {
                id: commentId,
            },
        });

        const requestUserId = getRequestUserId(req);

        await createActionLog({
            userId: requestUserId,
            action: "COMMENT_DELETED",
            entityType: "Comment",
            entityId: commentId,
            information: `Deleted comment ${commentId}.`,
            ipAddress: req.ip,
        });

        if (requestUserId) {
            await analyzeUserForSuspiciousBehavior(requestUserId);
        }

        return res.json({ message: "Comment deleted successfully." });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to delete comment.",
            error,
        });
    }
};