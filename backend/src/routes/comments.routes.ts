import { Router } from "express";
import {
    getCommentsByEventId,
    createComment,
    deleteComment,
} from "../controllers/comments.controller";
import { requirePermission } from "../middleware/requirePermission";
import { authenticateToken } from "../middleware/authenticateToken";

const router = Router();

router.get("/event/:eventId", getCommentsByEventId);
router.post(
    "/",
    authenticateToken,
    requirePermission("comments:create"),
    createComment
);

router.delete(
    "/:commentId",
    authenticateToken,
    requirePermission("comments:delete"),
    deleteComment
);

export default router;