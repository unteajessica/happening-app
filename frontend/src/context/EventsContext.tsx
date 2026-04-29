import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { EventItem } from "../types/event";
import {
    fetchEvents,
    createEventRequest,
    updateEventRequest,
    deleteEventRequest,
} from "../services/eventsApi";
import {
    addOfflineOperation,
    getOfflineQueue,
    removeFirstOfflineOperation,
} from "../utils/offlineQueue";
import { getCachedEvents, saveCachedEvents } from "../utils/eventsCache";

type EventsContextType = {
    newEvents: EventItem[];
    favorites: number[];
    isOnline: boolean;
    deleteEvent: (id: number) => Promise<void>;
    addEvent: (event: Omit<EventItem, "id">) => Promise<void>;
    updateEvent: (updatedEvent: EventItem) => Promise<void>;
    toggleFavorite: (id: number) => void;
    reloadEvents: () => Promise<void>;
};

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export function EventsProvider({ children }: { children: ReactNode }) {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [newEvents, setEvents] = useState<EventItem[]>(getCachedEvents());
    const [favorites, setFavorites] = useState<number[]>([]);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    useEffect(() => {
        saveCachedEvents(newEvents);
    }, [newEvents]);

    const syncOfflineOperations = async () => {
        const queue = getOfflineQueue();
        console.log("SYNC QUEUE:", queue);

        if (queue.length === 0) {
            return;
        }

        for (const operation of queue) {
            try {
                if (operation.type === "create") {
                    console.log("SYNCING CREATE PAYLOAD:", operation.payload);
                    await createEventRequest(operation.payload);
                } else if (operation.type === "update") {
                    const { id, ...eventData } = operation.payload;
                    await updateEventRequest(id, eventData);
                } else if (operation.type === "delete") {
                    await deleteEventRequest(operation.id);
                }

                removeFirstOfflineOperation();
            } catch (error) {
                console.error("Failed to sync offline operation:", error);
                break;
            }
        }

        try {
            const refreshedEvents = await fetchEvents();
            setEvents(refreshedEvents);
        } catch (error) {
            console.error("Failed to refresh events after sync:", error);
        }
    };

    useEffect(() => {
        if (!isOnline) {
            return;
        }

        syncOfflineOperations();
    }, [isOnline]);

    const hasDuplicateTitle = (title: string, excludeId?: number) => {
        const normalizedTitle = title.trim().toLowerCase();

        return newEvents.some((event) => {
            const sameId = excludeId !== undefined && event.id === excludeId;
            return !sameId && event.title.trim().toLowerCase() === normalizedTitle;
        });
    };

    const reloadEvents = async () => {
        if (!isOnline) {
            setEvents(getCachedEvents());
            return;
        }

        try {
            const events = await fetchEvents();
            setEvents(events);
        } catch (error) {
            console.error("Failed to load events:", error);
            setEvents(getCachedEvents());
            setIsOnline(false);
        }
    };

    useEffect(() => {
        if (isOnline) {
            reloadEvents();
        }
    }, [isOnline]);

    const deleteEvent = async (id: number) => {
        if (!isOnline) {
            setEvents((prev) => prev.filter((event) => event.id !== id));

            addOfflineOperation({
                type: "delete",
                id,
            });
            return;
        }

        try {
            await deleteEventRequest(id);
            setEvents((prev) => prev.filter((event) => event.id !== id));
        } catch (error) {
            console.error("Failed to delete event:", error);

            setEvents((prev) => prev.filter((event) => event.id !== id));
            addOfflineOperation({
                type: "delete",
                id,
            });
            setIsOnline(false);
        }
    };

    const addEvent = async (event: Omit<EventItem, "id">) => {
        console.log("addEvent called, isOnline =", isOnline);

        if (hasDuplicateTitle(event.title)) {
            throw new Error("This title already exists.");
        }

        if (!isOnline) {
            console.log("OFFLINE CREATE BRANCH");

            const localEvent: EventItem = {
                ...event,
                id: Date.now(),
            };

            setEvents((prev) => [...prev, localEvent]);
            addOfflineOperation({
                type: "create",
                payload: event,
            });
            return;
        }

        try {
            const createdEvent = await createEventRequest(event);
            setEvents((prev) => [...prev, createdEvent]);
        } catch (error) {
            console.error("Failed to add event:", error);

            const localEvent: EventItem = {
                ...event,
                id: Date.now(),
            };

            setEvents((prev) => [...prev, localEvent]);
            addOfflineOperation({
                type: "create",
                payload: event,
            });
            setIsOnline(false);
        }
    };

    const updateEvent = async (updatedEvent: EventItem) => {
        if (hasDuplicateTitle(updatedEvent.title, updatedEvent.id)) {
            throw new Error("This title already exists.");
        }

        if (!isOnline) {
            setEvents((prev) =>
                prev.map((event) =>
                    event.id === updatedEvent.id ? updatedEvent : event
                )
            );

            addOfflineOperation({
                type: "update",
                payload: updatedEvent,
            });
            return;
        }

        try {
            const { id, ...eventWithoutId } = updatedEvent;
            const savedEvent = await updateEventRequest(id, eventWithoutId);

            setEvents((prev) =>
                prev.map((event) =>
                    event.id === savedEvent.id ? savedEvent : event
                )
            );
        } catch (error) {
            console.error("Failed to update event:", error);

            setEvents((prev) =>
                prev.map((event) =>
                    event.id === updatedEvent.id ? updatedEvent : event
                )
            );

            addOfflineOperation({
                type: "update",
                payload: updatedEvent,
            });
            setIsOnline(false);
        }
    };

    const toggleFavorite = (id: number) => {
        setFavorites((prev) =>
            prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
        );
    };

    return (
        <EventsContext.Provider
            value={{
                newEvents,
                favorites,
                isOnline,
                deleteEvent,
                addEvent,
                updateEvent,
                toggleFavorite,
                reloadEvents,
            }}
        >
            {children}
        </EventsContext.Provider>
    );
}

export function useEvents() {
    const context = useContext(EventsContext);

    if (!context) {
        throw new Error("useEvents must be used inside EventsProvider");
    }

    return context;
}