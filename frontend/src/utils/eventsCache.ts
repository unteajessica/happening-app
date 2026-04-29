import type { EventItem } from "../types/event";

const EVENTS_CACHE_KEY = "cachedEvents";

export function getCachedEvents(): EventItem[] {
    const storedEvents = localStorage.getItem(EVENTS_CACHE_KEY);

    if (!storedEvents) {
        return [];
    }

    try {
        return JSON.parse(storedEvents) as EventItem[];
    } catch {
        return [];
    }
}

export function saveCachedEvents(events: EventItem[]): void {
    localStorage.setItem(EVENTS_CACHE_KEY, JSON.stringify(events));
}

export function clearCachedEvents(): void {
    localStorage.removeItem(EVENTS_CACHE_KEY);
}