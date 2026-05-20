"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createActionLog = createActionLog;
const prisma_1 = require("../db/prisma");
async function createActionLog(input) {
    let userData = {
        userEmail: null,
        userName: null,
        userRoleId: null,
        userRoleName: null,
    };
    if (input.userId) {
        const user = await prisma_1.prisma.user.findUnique({
            where: {
                id: input.userId,
            },
            include: {
                userRoles: {
                    include: {
                        role: true,
                    },
                    take: 1,
                },
            },
        });
        if (user) {
            const firstRole = user.userRoles[0]?.role;
            userData = {
                userEmail: user.email,
                userName: user.name,
                userRoleId: firstRole?.id ?? null,
                userRoleName: firstRole?.name ?? user.role,
            };
        }
    }
    return prisma_1.prisma.actionLog.create({
        data: {
            userId: input.userId ?? null,
            userEmail: userData.userEmail,
            userName: userData.userName,
            userRoleId: userData.userRoleId,
            userRoleName: userData.userRoleName,
            action: input.action,
            entityType: input.entityType ?? null,
            entityId: input.entityId !== undefined && input.entityId !== null
                ? String(input.entityId)
                : null,
            information: input.information,
            ipAddress: input.ipAddress ?? null,
        },
    });
}
