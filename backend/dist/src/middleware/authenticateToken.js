"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
const authToken_1 = require("../utils/authToken");
function authenticateToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                message: "Authorization token is required.",
            });
        }
        const [type, token] = authHeader.split(" ");
        if (type !== "Bearer" || !token) {
            return res.status(401).json({
                message: "Invalid authorization header.",
            });
        }
        const payload = (0, authToken_1.verifyAuthToken)(token);
        req.authUser = payload;
        next();
    }
    catch {
        return res.status(401).json({
            message: "Invalid or expired token.",
        });
    }
}
