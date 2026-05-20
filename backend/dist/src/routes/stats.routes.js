"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stats_controller_1 = require("../controllers/stats.controller");
const router = (0, express_1.Router)();
router.get("/categories", stats_controller_1.getCategoryStats);
router.get("/pricing", stats_controller_1.getPriceStats);
router.get("/comments", stats_controller_1.getCommentStats);
exports.default = router;
