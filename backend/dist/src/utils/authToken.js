"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthToken = createAuthToken;
exports.verifyAuthToken = verifyAuthToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function createAuthToken(payload) {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error("JWT_SECRET is missing from .env");
    }
    return jsonwebtoken_1.default.sign(payload, jwtSecret, {
        expiresIn: "1h",
    });
}
function verifyAuthToken(token) {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error("JWT_SECRET is missing from .env");
    }
    return jsonwebtoken_1.default.verify(token, jwtSecret);
}
