import type { EventItem } from "../types/event";
import type { CommentItem, CommentInput } from "../types/comment";

const BASE_URL =  import.meta.env.VITE_API_URL || "http://localhost:3000";

export type EventsPageResponse = {
    items: EventItem[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};

export type CommentStatsResponse = {
    totalComments: number;
    commentsByEvent: {
        eventId: number;
        eventTitle: string;
        commentCount: number;
    }[];
    mostCommentedEvents: {
        eventId: number;
        eventTitle: string;
        category: string;
        commentCount: number;
    }[];
    commentsByUser: {
        userId: number;
        userName: string;
        commentCount: number;
    }[];
};

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

export async function fetchEventsPage(
    page: number,
    limit: number
): Promise<EventsPageResponse> {
    const response = await fetch(`${BASE_URL}/events?page=${page}&limit=${limit}`);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch paged events");
    }

    return data;
}

export async function fetchEvents(): Promise<EventItem[]> {
    const data = await fetchEventsPage(1, 100);
    return data.items;
}

export async function fetchEventById(id: number): Promise<EventItem> {
    const response = await fetch(`${BASE_URL}/events/${id}`);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch event");
    }

    return data;
}

export async function createEventRequest(
    event: Omit<EventItem, "id">
): Promise<EventItem> {
    const response = await fetch(`${BASE_URL}/events`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(event),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.message || "Failed to create event");
    }

    return data;
}

export async function updateEventRequest(
    id: number,
    event: Omit<EventItem, "id">
): Promise<EventItem> {
    const response = await fetch(`${BASE_URL}/events/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(event),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.message || "Failed to update event");
    }

    return data;
}

export async function deleteEventRequest(id: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/events/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.message || "Failed to delete event");
    }
}

export async function fetchCommentsByEventId(eventId: number): Promise<CommentItem[]> {
    const response = await fetch(`${BASE_URL}/comments/event/${eventId}`);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch comments");
    }

    return data;
}

export async function createCommentRequest(
    comment: CommentInput
): Promise<CommentItem> {
    const response = await fetch(`${BASE_URL}/comments`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(comment),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.message || "Failed to create comment");
    }

    return data;
}

export async function deleteCommentRequest(commentId: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/comments/${commentId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.message || "Failed to delete comment");
    }
}

export async function fetchCommentStats(): Promise<CommentStatsResponse> {
    const response = await fetch(`${BASE_URL}/stats/comments`);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch comment stats");
    }

    return data;
}

export async function fetchCategoryStats(): Promise<
    { category: string; count: number }[]
> {
    const response = await fetch(`${BASE_URL}/stats/categories`);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch category stats");
    }

    return data;
}

export async function fetchPriceStats(): Promise<
    { name: string; value: number }[]
> {
    const response = await fetch(`${BASE_URL}/stats/pricing`);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch pricing stats");
    }

    return data;
}

export async function startGeneratorRequest(): Promise<{ message: string }> {
    const response = await fetch(`${BASE_URL}/generator/start`, {
        method: "POST",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.message || "Failed to start generator");
    }

    return data;
}

export async function stopGeneratorRequest(): Promise<{ message: string }> {
    const response = await fetch(`${BASE_URL}/generator/stop`, {
        method: "POST",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.message || "Failed to stop generator");
    }

    return data;
}

export async function fetchGeneratorStatus(): Promise<{ isRunning: boolean }> {
    const response = await fetch(`${BASE_URL}/generator/status`);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch generator status");
    }

    return data;
}