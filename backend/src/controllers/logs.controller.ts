import { Request, Response } from "express";
import { prisma } from "../db/prisma";

export const getActionLogs = async (req: Request, res: Response) => {
    try {
        const limit = Number(req.query.limit) || 100;

        const logs = await prisma.actionLog.findMany({
            orderBy: {
                createdAt: "desc",
            },
            take: limit,
        });

        return res.json(logs);
    } catch (error) {
        return res.status(500).json({
            message: "Failed to get action logs.",
            error,
        });
    }
};

export const getSuspiciousUsers = async (_req: Request, res: Response) => {
    try {
        const suspiciousUsers = await prisma.suspiciousUser.findMany({
            orderBy: {
                updatedAt: "desc",
            },
        });

        return res.json(suspiciousUsers);
    } catch (error) {
        return res.status(500).json({
            message: "Failed to get suspicious users.",
            error,
        });
    }
};

export const markSuspiciousUserReviewed = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                message: "Invalid suspicious user id.",
            });
        }

        const suspiciousUser = await prisma.suspiciousUser.findUnique({
            where: {
                id,
            },
        });

        if (!suspiciousUser) {
            return res.status(404).json({
                message: "Suspicious user record not found.",
            });
        }

        const updatedSuspiciousUser = await prisma.suspiciousUser.update({
            where: {
                id,
            },
            data: {
                status: "REVIEWED",
            },
        });

        return res.json(updatedSuspiciousUser);
    } catch (error) {
        return res.status(500).json({
            message: "Failed to review suspicious user.",
            error,
        });
    }
};

export const dismissSuspiciousUser = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                message: "Invalid suspicious user id.",
            });
        }

        const suspiciousUser = await prisma.suspiciousUser.findUnique({
            where: {
                id,
            },
        });

        if (!suspiciousUser) {
            return res.status(404).json({
                message: "Suspicious user record not found.",
            });
        }

        const updatedSuspiciousUser = await prisma.suspiciousUser.update({
            where: {
                id,
            },
            data: {
                status: "DISMISSED",
            },
        });

        return res.json(updatedSuspiciousUser);
    } catch (error) {
        return res.status(500).json({
            message: "Failed to dismiss suspicious user.",
            error,
        });
    }
};