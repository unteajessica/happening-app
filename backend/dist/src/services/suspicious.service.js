"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeUserForSuspiciousBehavior = analyzeUserForSuspiciousBehavior;
const prisma_1 = require("../db/prisma");
const TEN_MINUTES_MS = 10 * 60 * 1000;
const ONE_MINUTE_MS = 60 * 1000;
async function markUserSuspicious(userId, reason, score) {
    const user = await prisma_1.prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!user) {
        return;
    }
    const existingActiveRecord = await prisma_1.prisma.suspiciousUser.findFirst({
        where: {
            userId,
            status: "ACTIVE",
        },
    });
    if (existingActiveRecord) {
        await prisma_1.prisma.suspiciousUser.update({
            where: {
                id: existingActiveRecord.id,
            },
            data: {
                score,
                reason,
            },
        });
        return;
    }
    await prisma_1.prisma.suspiciousUser.create({
        data: {
            userId: user.id,
            userEmail: user.email,
            userName: user.name,
            reason,
            score,
            status: "ACTIVE",
        },
    });
}
async function analyzeUserForSuspiciousBehavior(userId) {
    const tenMinutesAgo = new Date(Date.now() - TEN_MINUTES_MS);
    const oneMinuteAgo = new Date(Date.now() - ONE_MINUTE_MS);
    const recentPermissionDeniedCount = await prisma_1.prisma.actionLog.count({
        where: {
            userId,
            action: "PERMISSION_DENIED",
            createdAt: {
                gte: tenMinutesAgo,
            },
        },
    });
    if (recentPermissionDeniedCount >= 3) {
        await markUserSuspicious(userId, `User had ${recentPermissionDeniedCount} permission denied attempts in the last 10 minutes.`, recentPermissionDeniedCount);
        return;
    }
    const recentDeleteCount = await prisma_1.prisma.actionLog.count({
        where: {
            userId,
            action: {
                in: ["EVENT_DELETED", "COMMENT_DELETED", "CATEGORY_DELETED"],
            },
            createdAt: {
                gte: tenMinutesAgo,
            },
        },
    });
    if (recentDeleteCount >= 5) {
        await markUserSuspicious(userId, `User performed ${recentDeleteCount} delete actions in the last 10 minutes.`, recentDeleteCount);
        return;
    }
    const recentChatMessageCount = await prisma_1.prisma.actionLog.count({
        where: {
            userId,
            action: "CHAT_MESSAGE_SENT",
            createdAt: {
                gte: oneMinuteAgo,
            },
        },
    });
    if (recentChatMessageCount >= 10) {
        await markUserSuspicious(userId, `User sent ${recentChatMessageCount} chat messages in the last minute.`, recentChatMessageCount);
    }
}
