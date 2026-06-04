export type LoggedInUser = {
    id: number;
    name: string;
    email: string;
    roles: string[];
    permissions: string[];
};

export type AuthResponse = {
    user: LoggedInUser;
    token: string;
};

export type LoginStartResponse = {
    message: string;
    requiresVerification: boolean;
    email: string;
};

const BASE_URL = import.meta.env.VITE_API_URL || "https://localhost:3000";

export async function loginRequest(
    email: string,
    password: string
): Promise<LoginStartResponse> {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.message || "Failed to login.");
    }

    return data;
}

export async function verifyLoginRequest(
    email: string,
    code: string
): Promise<AuthResponse> {
    const response = await fetch(`${BASE_URL}/auth/verify-login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            code,
        }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.message || "Failed to verify login.");
    }

    return data;
}

export async function registerRequest(
    name: string,
    email: string,
    password: string
): Promise<AuthResponse> {
    const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            email,
            password,
        }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.message || "Failed to register.");
    }

    return data;
}

export async function forgotPasswordRequest(email: string): Promise<{ message: string }> {
    const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
        }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.message || "Failed to request password reset.");
    }

    return data;
}

export async function resetPasswordRequest(
    email: string,
    code: string,
    newPassword: string
): Promise<{ message: string }> {
    const response = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            code,
            newPassword,
        }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.message || "Failed to reset password.");
    }

    return data;
}