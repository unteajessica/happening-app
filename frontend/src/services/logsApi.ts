export type ActionLogItem = {
    id: number;
    userId: number | null;
    userEmail: string | null;
    userName: string | null;
    userRoleId: number | null;
    userRoleName: string | null;
    action: string;
    entityType: string | null;
    entityId: string | null;
    information: string;
    ipAddress: string | null;
    createdAt: string;
};

export type SuspiciousUserItem = {
    id: number;
    userId: number | null;
    userEmail: string | null;
    userName: string | null;
    reason: string;
    score: number;
    status: "ACTIVE" | "REVIEWED" | "DISMISSED";
    createdAt: string;
    updatedAt: string;
};

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function getAuthToken() {
    return localStorage.getItem("happening_auth_token");
}

function getAuthHeaders(): HeadersInit {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    const token = getAuthToken();

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return headers;
}

export async function fetchActionLogs(): Promise<ActionLogItem[]> {
    const response = await fetch(`${BASE_URL}/logs?limit=100`, {
        headers: getAuthHeaders(),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch action logs.");
    }

    return data;
}

export async function fetchSuspiciousUsers(): Promise<SuspiciousUserItem[]> {
    const response = await fetch(`${BASE_URL}/logs/suspicious-users`, {
        headers: getAuthHeaders(),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch suspicious users.");
    }

    return data;
}

export async function reviewSuspiciousUser(
    id: number
): Promise<SuspiciousUserItem> {
    const response = await fetch(`${BASE_URL}/logs/suspicious-users/${id}/review`, {
        method: "PUT",
        headers: getAuthHeaders(),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.message || "Failed to review suspicious user.");
    }

    return data;
}

export async function dismissSuspiciousUser(
    id: number
): Promise<SuspiciousUserItem> {
    const response = await fetch(`${BASE_URL}/logs/suspicious-users/${id}/dismiss`, {
        method: "PUT",
        headers: getAuthHeaders(),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.message || "Failed to dismiss suspicious user.");
    }

    return data;
}