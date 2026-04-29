import { Request, Response } from "express";
import { events, getNextEventId, replaceEvents } from "../data/events.memory";
import type { EventInput, EventItem } from "../data/event";
import { validateEventInput } from "../validators/event.validator";
import { comments, replaceComments } from "../data/comments.memory";

export const getAllEvents = (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedEvents = events.slice(startIndex, endIndex);

    res.json({
        items: paginatedEvents,
        page,
        limit,
        total: events.length,
        totalPages: Math.ceil(events.length / limit)
    });
};

export const getEventById = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const event = events.find((e) => e.id === id);

    if (!event) {
        return res.status(404).json({ message: "Event not found." });
    }

    return res.json(event);
};

export const createEvent = (req: Request, res: Response) => {
    const eventData: Partial<EventInput> = req.body;

    const validationError = validateEventInput(eventData);
    if (Object.keys(validationError).length > 0) {
        return res.status(400).json({ validationError });
    }

    const titleExists = events.some(
        (e) => e.title.toLowerCase() === eventData.title!.toLowerCase()
    );

    if (titleExists) {
        return res.status(400).json({ message: "This title already exists." });
    }

    const newEvent: EventItem = {
        id: getNextEventId(),
        title: eventData.title!,
        category: eventData.category!,
        date: eventData.date!,
        location: eventData.location!,
        price: eventData.price!,
        description: eventData.description!,
        imageUrl: eventData.imageUrl!
    };

    events.push(newEvent);

    return res.status(201).json(newEvent);
};

export const updateEvent = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const eventIndex = events.findIndex((e) => e.id === id);

    if (eventIndex === -1) {
        return res.status(404).json({ message: "Event not found." });
    }

    const eventData: Partial<EventInput> = req.body;

    const validationError = validateEventInput(eventData);
    if (Object.keys(validationError).length > 0) {
        return res.status(400).json({ validationError });
    }

    const duplicateTitle = events.some(
        (e) =>
            e.id !== id &&
            e.title.toLowerCase() === eventData.title!.toLowerCase()
    );

    if (duplicateTitle) {
        return res.status(400).json({ message: "This title already exists." });
    }

    const updatedEvent: EventItem = {
        id,
        title: eventData.title!,
        category: eventData.category!,
        date: eventData.date!,
        location: eventData.location!,
        price: eventData.price!,
        description: eventData.description!,
        imageUrl: eventData.imageUrl!
    };

    events[eventIndex] = updatedEvent;

    return res.json(updatedEvent);
};

export const deleteEvent = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const eventExists = events.some((e) => e.id === id);

    if (!eventExists) {
        return res.status(404).json({ message: "Event not found." });
    }

    const updatedEvents = events.filter((e) => e.id !== id);
    const updatedComments = comments.filter((comment) => comment.eventId !== id);
    replaceEvents(updatedEvents);
    replaceComments(updatedComments);

    return res.json({ message: "Event deleted successfully." });
};