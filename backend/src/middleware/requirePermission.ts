import { Request, Response, NextFunction } from "express";
import { createActionLog } from "../services/log.service";
import { analyzeUserForSuspiciousBehavior } from "../services/suspicious.service";

export function requirePermission(requiredPermission: string) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authUser = req.authUser;

            if (!authUser) {
                await createActionLog({
                    action: "PERMISSION_DENIED",
                    information: `Permission denied for ${requiredPermission}: missing authenticated user.`,
                    ipAddress: req.ip,
                });

                return res.status(401).json({
                    message: "Authenticated user is required.",
                });
            }

            if (!authUser.permissions.includes(requiredPermission)) {
                await createActionLog({
                    userId: authUser.userId,
                    action: "PERMISSION_DENIED",
                    entityType: "Permission",
                    entityId: requiredPermission,
                    information: `User ${authUser.email} tried to access ${requiredPermission} without permission.`,
                    ipAddress: req.ip,
                });

                await analyzeUserForSuspiciousBehavior(authUser.userId);

                return res.status(403).json({
                    message: "You do not have permission to perform this action.",
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                message: "Failed to check permissions.",
                error,
            });
        }
    };
}