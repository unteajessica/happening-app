import { Router } from "express";
import {
    getActionLogs,
    getSuspiciousUsers,
    markSuspiciousUserReviewed,
    dismissSuspiciousUser,
} from "../controllers/logs.controller";
import { requirePermission } from "../middleware/requirePermission";
import { authenticateToken } from "../middleware/authenticateToken";

const router = Router();

router.get(
    "/",
    authenticateToken,
    requirePermission("logs:read"),
    getActionLogs
);

router.get(
    "/suspicious-users",
    authenticateToken,
    requirePermission("suspicious-users:read"),
    getSuspiciousUsers
);

router.put(
    "/suspicious-users/:id/review",
    authenticateToken,
    requirePermission("suspicious-users:update"),
    markSuspiciousUserReviewed
);

router.put(
    "/suspicious-users/:id/dismiss",
    authenticateToken,
    requirePermission("suspicious-users:update"),
    dismissSuspiciousUser
);

export default router;