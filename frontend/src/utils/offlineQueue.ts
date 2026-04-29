import type { OfflineOperation } from "../types/offlineOperation";

const OFFLINE_QUEUE_KEY = "offlineEventQueue";

export function getOfflineQueue(): OfflineOperation[] {
    const storedQueue = localStorage.getItem(OFFLINE_QUEUE_KEY);

    if (!storedQueue) {
        return [];
    }

    try {
        return JSON.parse(storedQueue) as OfflineOperation[];
    } catch {
        return [];
    }
}

export function saveOfflineQueue(queue: OfflineOperation[]): void {
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
}

export function addOfflineOperation(operation: OfflineOperation): void {
    const currentQueue = getOfflineQueue();
    const updatedQueue = [...currentQueue, operation];
    saveOfflineQueue(updatedQueue);
}

export function removeFirstOfflineOperation(): void {
    const currentQueue = getOfflineQueue();

    if (currentQueue.length === 0) {
        return;
    }

    const updatedQueue = currentQueue.slice(1);
    saveOfflineQueue(updatedQueue);
}

export function clearOfflineQueue(): void {
    localStorage.removeItem(OFFLINE_QUEUE_KEY);
}

