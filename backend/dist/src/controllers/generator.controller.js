"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startGeneratorController = startGeneratorController;
exports.stopGeneratorController = stopGeneratorController;
exports.getGeneratorStatusController = getGeneratorStatusController;
const generator_service_1 = require("../services/generator.service");
function startGeneratorController(_req, res) {
    const result = (0, generator_service_1.startGenerator)();
    res.status(200).json(result);
}
function stopGeneratorController(_req, res) {
    const result = (0, generator_service_1.stopGenerator)();
    res.status(200).json(result);
}
function getGeneratorStatusController(_req, res) {
    const result = (0, generator_service_1.getGeneratorStatus)();
    res.status(200).json(result);
}
