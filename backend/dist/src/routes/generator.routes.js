"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const generator_controller_1 = require("../controllers/generator.controller");
const router = (0, express_1.Router)();
router.get("/status", generator_controller_1.getGeneratorStatusController);
router.post("/start", generator_controller_1.startGeneratorController);
router.post("/stop", generator_controller_1.stopGeneratorController);
exports.default = router;
