import { Router } from "express";
import { getCategoryStats, getPriceStats, getCommentStats } from "../controllers/stats.controller";

const router = Router();

router.get("/categories", getCategoryStats);
router.get("/pricing", getPriceStats);
router.get("/comments", getCommentStats);

export default router;