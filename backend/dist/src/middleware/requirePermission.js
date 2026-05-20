"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requirePermission = requirePermission;
const log_service_1 = require("../services/log.service");
const suspicious_service_1 = require("../services/suspicious.service");
function requirePermission(requiredPermission) {
    return async (req, res, next) => {
        try {
            const authUser = req.authUser;
            if (!authUser) {
                await (0, log_service_1.createActionLog)({
                    action: "PERMISSION_DENIED",
                    information: `Permission denied for ${requiredPermission}: missing authenticated user.`,
                    ipAddress: req.ip,
                });
                return res.status(401).json({
                    message: "Authenticated user is required.",
                });
            }
            if (!authUser.permissions.includes(requiredPermission)) {
                await (0, log_service_1.createActionLog)({
                    userId: authUser.userId,
                    action: "PERMISSION_DENIED",
                    entityType: "Permission",
                    entityId: requiredPermission,
                    information: `User ${authUser.email} tried to access ${requiredPermission} without permission.`,
                    ipAddress: req.ip,
                });
                await (0, suspicious_service_1.analyzeUserForSuspiciousBehavior)(authUser.userId);
                return res.status(403).json({
                    message: "You do not have permission to perform this action.",
                });
            }
            next();
        }
        catch (error) {
            return res.status(500).json({
                message: "Failed to check permissions.",
                error,
            });
        }
    };
}
