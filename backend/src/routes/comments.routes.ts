import { Router } from "express";
import {
    getCommentsByEventId,
    createComment,
    deleteComment,
    getCommentStats,
} from "../controllers/comments.controller";

const router = Router();

router.get("/event/:eventId", getCommentsByEventId);
router.post("/", createComment);
router.delete("/:commentId", deleteComment);
router.get("/stats", getCommentStats);

export default router;