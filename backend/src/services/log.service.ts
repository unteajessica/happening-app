import { prisma } from "../db/prisma";

type CreateActionLogInput = {
    userId?: number | null;
    action: string;
    entityType?: string | null;
    entityId?: string | number | null;
    information: string;
    ipAddress?: string | null;
};

export async function createActionLog(input: CreateActionLogInput) {
    let userData = {
        userEmail: null as string | null,
        userName: null as string | null,
        userRoleId: null as number | null,
        userRoleName: null as string | null,
    };

    if (input.userId) {
        const user = await prisma.user.findUnique({
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

    return prisma.actionLog.create({
        data: {
            userId: input.userId ?? null,
            userEmail: userData.userEmail,
            userName: userData.userName,
            userRoleId: userData.userRoleId,
            userRoleName: userData.userRoleName,
            action: input.action,
            entityType: input.entityType ?? null,
            entityId:
                input.entityId !== undefined && input.entityId !== null
                    ? String(input.entityId)
                    : null,
            information: input.information,
            ipAddress: input.ipAddress ?? null,
        },
    });
}