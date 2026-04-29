import { Router } from "express";
import { getCategoryStats, getPriceStats } from "../controllers/stats.controller";

const router = Router();

router.get("/categories", getCategoryStats);
router.get("/pricing", getPriceStats);

export default router;