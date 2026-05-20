import { Request, Response, NextFunction } from "express";
import { verifyAuthToken, type AuthTokenPayload } from "../utils/authToken";

declare global {
    namespace Express {
        interface Request {
            authUser?: AuthTokenPayload;
        }
    }
}

export function authenticateToken(
    req: Request,
    res: Response,
    next: NextFunction
) {
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

        const payload = verifyAuthToken(token);

        req.authUser = payload;

        next();
    } catch {
        return res.status(401).json({
            message: "Invalid or expired token.",
        });
    }
}