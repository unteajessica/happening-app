export type ChatMessageItem = {
    id: string;
    roomId: string;
    userId: number;
    userName: string;
    message: string;
    createdAt: string;
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

export async function fetchChatMessages(): Promise<ChatMessageItem[]> {
    const response = await fetch(`${BASE_URL}/chat/messages`, {
        headers: getAuthHeaders(),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch chat messages.");
    }

    return data;
}

export async function deleteChatMessages(): Promise<{ message: string }> {
    const response = await fetch(`${BASE_URL}/chat/messages`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.message || "Failed to delete chat messages.");
    }

    return data;
}