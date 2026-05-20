import { Request, Response } from "express";
import { prisma } from "../db/prisma";

export const getCategoryStats = async (_req: Request, res: Response) => {
    try {
        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: {
                        events: true,
                    },
                },
            },
            orderBy: {
                name: "asc",
            },
        });

        const stats = categories.map((category) => ({
            category: category.name,
            count: category._count.events,
        }));

        return res.json(stats);
    } catch (error) {
        return res.status(500).json({
            message: "Failed to get category statistics.",
            error,
        });
    }
};

export const getPriceStats = async (_req: Request, res: Response) => {
    try {
        const freeEvents = await prisma.event.count({
            where: {
                price: 0,
            },
        });

        const paidEvents = await prisma.event.count({
            where: {
                price: {
                    gt: 0,
                },
            },
        });

        return res.json([
            {
                name: "Free",
                value: freeEvents,
            },
            {
                name: "Paid",
                value: paidEvents,
            },
        ]);
    } catch (error) {
        return res.status(500).json({
            message: "Failed to get price statistics.",
            error,
        });
    }
};

export const getCommentStats = async (_req: Request, res: Response) => {
    try {
        const totalComments = await prisma.comment.count();

        const eventsWithCommentCounts = await prisma.event.findMany({
            include: {
                _count: {
                    select: {
                        comments: true,
                    },
                },
            },
            orderBy: {
                title: "asc",
            },
        });

        const commentsByEvent = eventsWithCommentCounts.map((event) => ({
            eventId: event.id,
            eventTitle: event.title,
            commentCount: event._count.comments,
        }));

        const mostCommentedEvents = await prisma.event.findMany({
            include: {
                category: true,
                _count: {
                    select: {
                        comments: true,
                    },
                },
            },
            orderBy: {
                comments: {
                    _count: "desc",
                },
            },
            take: 5,
        });

        const topEvents = mostCommentedEvents.map((event) => ({
            eventId: event.id,
            eventTitle: event.title,
            category: event.category.name,
            commentCount: event._count.comments,
        }));

        const usersWithCommentCounts = await prisma.user.findMany({
            include: {
                _count: {
                    select: {
                        comments: true,
                    },
                },
            },
            orderBy: {
                name: "asc",
            },
        });

        const commentsByUser = usersWithCommentCounts.map((user) => ({
            userId: user.id,
            userName: user.name,
            commentCount: user._count.comments,
        }));

        return res.json({
            totalComments,
            commentsByEvent,
            mostCommentedEvents: topEvents,
            commentsByUser,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to get comment statistics.",
            error,
        });
    }
};