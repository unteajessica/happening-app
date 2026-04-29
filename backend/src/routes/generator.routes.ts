import { Router } from "express";
import {
    startGeneratorController,
    stopGeneratorController,
    getGeneratorStatusController,
} from "../controllers/generator.controller";

const router = Router();

router.get("/status", getGeneratorStatusController);
router.post("/start", startGeneratorController);
router.post("/stop", stopGeneratorController);

export default router;