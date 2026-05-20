import { Router } from "express";
import {
    getChatMessages,
    deleteChatMessages,
} from "../controllers/chat.controller";
import { requirePermission } from "../middleware/requirePermission";
import { authenticateToken } from "../middleware/authenticateToken";

const router = Router();

router.get(
    "/messages",
    authenticateToken,
    requirePermission("chat:use"),
    getChatMessages
);

router.delete(
    "/messages",
    authenticateToken,
    requirePermission("chat:delete"),
    deleteChatMessages
);

export default router;