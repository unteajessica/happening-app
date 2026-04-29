import { Request, Response } from "express";
import type { CommentInput, CommentItem } from "../data/comment";
import { comments, getNextCommentId, replaceComments } from "../data/comments.memory";
import { events } from "../data/events.memory";
import { validateCommentInput } from "../validators/comment.validator";

export const getCommentsByEventId = (req: Request, res: Response) => {
    const eventId = Number(req.params.eventId);

    const eventExists = events.some((event) => event.id === eventId);

    if (!eventExists) {
        return res.status(404).json({ message: "Event not found." });
    }

    const eventComments = comments
        .filter((comment) => comment.eventId === eventId)
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

    return res.json(eventComments);
};

export const createComment = (req: Request, res: Response) => {
    const commentData: Partial<CommentInput> = req.body;

    const validationErrors = validateCommentInput(commentData);

    if (Object.keys(validationErrors).length > 0) {
        return res.status(400).json({ validationErrors });
    }

    const eventExists = events.some((event) => event.id === commentData.eventId);

    if (!eventExists) {
        return res.status(404).json({ message: "Event not found." });
    }

    const newComment: CommentItem = {
        id: getNextCommentId(),
        eventId: commentData.eventId!,
        author: commentData.author!.trim(),
        message: commentData.message!.trim(),
        createdAt: new Date().toISOString(),
    };

    comments.push(newComment);

    return res.status(201).json(newComment);
};

export const deleteComment = (req: Request, res: Response) => {
    const commentId = Number(req.params.commentId);

    const commentExists = comments.some((comment) => comment.id === commentId);

    if (!commentExists) {
        return res.status(404).json({ message: "Comment not found." });
    }

    const updatedComments = comments.filter((comment) => comment.id !== commentId);
    replaceComments(updatedComments);

    return res.json({ message: "Comment deleted successfully." });
};

export const getCommentStats = (_req: Request, res: Response) => {
    const stats = events.map((event) => ({
        eventId: event.id,
        eventTitle: event.title,
        commentCount: comments.filter((comment) => comment.eventId === event.id).length,
    }));

    return res.json(stats);
};