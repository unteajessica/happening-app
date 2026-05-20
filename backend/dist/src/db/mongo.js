"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMongo = connectMongo;
const mongoose_1 = __importDefault(require("mongoose"));
async function connectMongo() {
    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl) {
        throw new Error("MONGO_URL is missing from .env");
    }
    if (mongoose_1.default.connection.readyState === 1) {
        console.log("MongoDB already connected.");
        return;
    }
    await mongoose_1.default.connect(mongoUrl);
    console.log("MongoDB connected successfully.");
}
