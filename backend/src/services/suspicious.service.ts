import { prisma } from "../db/prisma";

const TEN_MINUTES_MS = 10 * 60 * 1000;
const ONE_MINUTE_MS = 60 * 1000;

async function markUserSuspicious(userId: number, reason: string, score: number) {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!user) {
        return;
    }

    const existingActiveRecord = await prisma.suspiciousUser.findFirst({
        where: {
            userId,
            status: "ACTIVE",
        },
    });

    if (existingActiveRecord) {
        await prisma.suspiciousUser.update({
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

    await prisma.suspiciousUser.create({
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

export async function analyzeUserForSuspiciousBehavior(userId: number) {
    const tenMinutesAgo = new Date(Date.now() - TEN_MINUTES_MS);
    const oneMinuteAgo = new Date(Date.now() - ONE_MINUTE_MS);

    const recentPermissionDeniedCount = await prisma.actionLog.count({
        where: {
            userId,
            action: "PERMISSION_DENIED",
            createdAt: {
                gte: tenMinutesAgo,
            },
        },
    });

    if (recentPermissionDeniedCount >= 3) {
        await markUserSuspicious(
            userId,
            `User had ${recentPermissionDeniedCount} permission denied attempts in the last 10 minutes.`,
            recentPermissionDeniedCount
        );

        return;
    }

    const recentDeleteCount = await prisma.actionLog.count({
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
        await markUserSuspicious(
            userId,
            `User performed ${recentDeleteCount} delete actions in the last 10 minutes.`,
            recentDeleteCount
        );

        return;
    }

    const recentChatMessageCount = await prisma.actionLog.count({
        where: {
            userId,
            action: "CHAT_MESSAGE_SENT",
            createdAt: {
                gte: oneMinuteAgo,
            },
        },
    });

    if (recentChatMessageCount >= 10) {
        await markUserSuspicious(
            userId,
            `User sent ${recentChatMessageCount} chat messages in the last minute.`,
            recentChatMessageCount
        );
    }
}