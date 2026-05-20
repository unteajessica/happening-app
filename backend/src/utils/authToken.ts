import jwt from "jsonwebtoken";

export type AuthTokenPayload = {
    userId: number;
    email: string;
    roles: string[];
    permissions: string[];
};

export function createAuthToken(payload: AuthTokenPayload) {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        throw new Error("JWT_SECRET is missing from .env");
    }

    return jwt.sign(payload, jwtSecret, {
        expiresIn: "1h",
    });
}

export function verifyAuthToken(token: string): AuthTokenPayload {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        throw new Error("JWT_SECRET is missing from .env");
    }

    return jwt.verify(token, jwtSecret) as AuthTokenPayload;
}