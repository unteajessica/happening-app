"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dismissSuspiciousUser = exports.markSuspiciousUserReviewed = exports.getSuspiciousUsers = exports.getActionLogs = void 0;
const prisma_1 = require("../db/prisma");
const getActionLogs = async (req, res) => {
    try {
        const limit = Number(req.query.limit) || 100;
        const logs = await prisma_1.prisma.actionLog.findMany({
            orderBy: {
                createdAt: "desc",
            },
            take: limit,
        });
        return res.json(logs);
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to get action logs.",
            error,
        });
    }
};
exports.getActionLogs = getActionLogs;
const getSuspiciousUsers = async (_req, res) => {
    try {
        const suspiciousUsers = await prisma_1.prisma.suspiciousUser.findMany({
            orderBy: {
                updatedAt: "desc",
            },
        });
        return res.json(suspiciousUsers);
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to get suspicious users.",
            error,
        });
    }
};
exports.getSuspiciousUsers = getSuspiciousUsers;
const markSuspiciousUserReviewed = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({
                message: "Invalid suspicious user id.",
            });
        }
        const suspiciousUser = await prisma_1.prisma.suspiciousUser.findUnique({
            where: {
                id,
            },
        });
        if (!suspiciousUser) {
            return res.status(404).json({
                message: "Suspicious user record not found.",
            });
        }
        const updatedSuspiciousUser = await prisma_1.prisma.suspiciousUser.update({
            where: {
                id,
            },
            data: {
                status: "REVIEWED",
            },
        });
        return res.json(updatedSuspiciousUser);
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to review suspicious user.",
            error,
        });
    }
};
exports.markSuspiciousUserReviewed = markSuspiciousUserReviewed;
const dismissSuspiciousUser = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({
                message: "Invalid suspicious user id.",
            });
        }
        const suspiciousUser = await prisma_1.prisma.suspiciousUser.findUnique({
            where: {
                id,
            },
        });
        if (!suspiciousUser) {
            return res.status(404).json({
                message: "Suspicious user record not found.",
            });
        }
        const updatedSuspiciousUser = await prisma_1.prisma.suspiciousUser.update({
            where: {
                id,
            },
            data: {
                status: "DISMISSED",
            },
        });
        return res.json(updatedSuspiciousUser);
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to dismiss suspicious user.",
            error,
        });
    }
};
exports.dismissSuspiciousUser = dismissSuspiciousUser;
