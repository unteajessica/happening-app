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

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function loginRequest(
    email: string,
    password: string
): Promise<AuthResponse> {
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