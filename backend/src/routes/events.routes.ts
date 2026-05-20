import { Router } from "express";
import {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
} from "../controllers/events.controller";
import { requirePermission } from "../middleware/requirePermission";
import { authenticateToken } from "../middleware/authenticateToken";

const router = Router();

router.get("/", getAllEvents);
router.get("/:id", getEventById);

router.post(
    "/",
    authenticateToken,
    requirePermission("events:create"),
    createEvent
);

router.put(
    "/:id",
    authenticateToken,
    requirePermission("events:update"),
    updateEvent
);

router.delete(
    "/:id",
    authenticateToken,
    requirePermission("events:delete"),
    deleteEvent
);
export default router;