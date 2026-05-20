"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.updateEvent = exports.createEvent = exports.getEventById = exports.getAllEvents = void 0;
const prisma_1 = require("../db/prisma");
const event_validator_1 = require("../validators/event.validator");
const log_service_1 = require("../services/log.service");
const suspicious_service_1 = require("../services/suspicious.service");
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}
function parseDate(date) {
    if (/^\d{2}-\d{2}-\d{4}$/.test(date)) {
        const [day, month, year] = date.split("-");
        return new Date(`${year}-${month}-${day}T00:00:00`);
    }
    return new Date(date);
}
function formatPrice(price) {
    if (price === 0) {
        return "Free";
    }
    return `$${price}`;
}
function parsePrice(price) {
    if (price === undefined) {
        return 0;
    }
    if (typeof price === "number") {
        return price;
    }
    if (price.toLowerCase().trim() === "free") {
        return 0;
    }
    const cleanedPrice = price.replace("$", "").trim();
    return Number(cleanedPrice);
}
function formatComment(comment) {
    return {
        id: comment.id,
        eventId: comment.eventId,
        author: comment.user?.name ?? "Unknown",
        message: comment.content,
        createdAt: comment.createdAt.toISOString(),
    };
}
function formatEvent(event) {
    return {
        id: event.id,
        title: event.title,
        category: event.category.name,
        date: formatDate(event.date),
        location: event.location,
        price: formatPrice(event.price),
        description: event.description,
        imageUrl: event.imageUrl ?? "",
    };
}
function getRequestUserId(req) {
    return req.authUser?.userId ?? null;
}
const getAllEvents = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 6;
        const search = req.query.search;
        const category = req.query.category;
        const location = req.query.location;
        const minPrice = req.query.minPrice
            ? parsePrice(req.query.minPrice)
            : undefined;
        const maxPrice = req.query.maxPrice
            ? parsePrice(req.query.maxPrice)
            : undefined;
        const skip = (page - 1) * limit;
        const where = {
            title: search
                ? {
                    contains: search,
                    mode: "insensitive",
                }
                : undefined,
            category: category
                ? {
                    name: {
                        equals: category,
                        mode: "insensitive",
                    },
                }
                : undefined,
            location: location
                ? {
                    contains: location,
                    mode: "insensitive",
                }
                : undefined,
            price: minPrice !== undefined || maxPrice !== undefined
                ? {
                    gte: minPrice,
                    lte: maxPrice,
                }
                : undefined,
        };
        const [events, total] = await Promise.all([
            prisma_1.prisma.event.findMany({
                where,
                include: {
                    category: true,
                },
                orderBy: {
                    id: "asc",
                },
                skip,
                take: limit,
            }),
            prisma_1.prisma.event.count({
                where,
            }),
        ]);
        return res.json({
            items: events.map(formatEvent),
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to get events.",
            error,
        });
    }
};
exports.getAllEvents = getAllEvents;
const getEventById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const event = await prisma_1.prisma.event.findUnique({
            where: { id },
            include: {
                category: true,
                comments: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                role: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
        });
        if (!event) {
            return res.status(404).json({ message: "Event not found." });
        }
        return res.json({
            ...formatEvent(event),
            comments: event.comments.map(formatComment),
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to get event.",
            error,
        });
    }
};
exports.getEventById = getEventById;
const createEvent = async (req, res) => {
    try {
        const requestUserId = getRequestUserId(req);
        if (!requestUserId) {
            return res.status(401).json({
                message: "Authenticated user is required.",
            });
        }
        const eventData = req.body;
        const validationError = (0, event_validator_1.validateEventInput)(eventData);
        if (Object.keys(validationError).length > 0) {
            return res.status(400).json({ validationError });
        }
        const parsedPrice = parsePrice(eventData.price);
        if (Number.isNaN(parsedPrice)) {
            return res.status(400).json({
                message: "Invalid price.",
            });
        }
        const titleExists = await prisma_1.prisma.event.findFirst({
            where: {
                title: {
                    equals: eventData.title,
                    mode: "insensitive",
                },
            },
        });
        if (titleExists) {
            return res.status(400).json({ message: "This title already exists." });
        }
        const category = await prisma_1.prisma.category.upsert({
            where: {
                name: eventData.category,
            },
            update: {},
            create: {
                name: eventData.category,
                description: `${eventData.category} events`,
            },
        });
        const newEvent = await prisma_1.prisma.event.create({
            data: {
                title: eventData.title,
                description: eventData.description,
                date: parseDate(eventData.date),
                location: eventData.location,
                price: parsedPrice,
                imageUrl: eventData.imageUrl,
                categoryId: category.id,
                createdById: requestUserId,
            },
            include: {
                category: true,
            },
        });
        await (0, log_service_1.createActionLog)({
            userId: requestUserId,
            action: "EVENT_CREATED",
            entityType: "Event",
            entityId: newEvent.id,
            information: `Created event "${newEvent.title}".`,
            ipAddress: req.ip,
        });
        return res.status(201).json(formatEvent(newEvent));
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to create event.",
            error,
        });
    }
};
exports.createEvent = createEvent;
const updateEvent = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const existingEvent = await prisma_1.prisma.event.findUnique({
            where: { id },
        });
        if (!existingEvent) {
            return res.status(404).json({ message: "Event not found." });
        }
        const eventData = req.body;
        const validationError = (0, event_validator_1.validateEventInput)(eventData);
        if (Object.keys(validationError).length > 0) {
            return res.status(400).json({ validationError });
        }
        const parsedPrice = parsePrice(eventData.price);
        if (Number.isNaN(parsedPrice)) {
            return res.status(400).json({
                message: "Invalid price.",
            });
        }
        const duplicateTitle = await prisma_1.prisma.event.findFirst({
            where: {
                id: {
                    not: id,
                },
                title: {
                    equals: eventData.title,
                    mode: "insensitive",
                },
            },
        });
        if (duplicateTitle) {
            return res.status(400).json({ message: "This title already exists." });
        }
        const category = await prisma_1.prisma.category.upsert({
            where: {
                name: eventData.category,
            },
            update: {},
            create: {
                name: eventData.category,
                description: `${eventData.category} events`,
            },
        });
        const updatedEvent = await prisma_1.prisma.event.update({
            where: { id },
            data: {
                title: eventData.title,
                description: eventData.description,
                date: parseDate(eventData.date),
                location: eventData.location,
                price: parsedPrice,
                imageUrl: eventData.imageUrl,
                categoryId: category.id,
            },
            include: {
                category: true,
            },
        });
        const requestUserId = getRequestUserId(req);
        await (0, log_service_1.createActionLog)({
            userId: requestUserId,
            action: "EVENT_UPDATED",
            entityType: "Event",
            entityId: updatedEvent.id,
            information: `Updated event "${updatedEvent.title}".`,
            ipAddress: req.ip,
        });
        return res.json(formatEvent(updatedEvent));
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to update event.",
            error,
        });
    }
};
exports.updateEvent = updateEvent;
const deleteEvent = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const eventExists = await prisma_1.prisma.event.findUnique({
            where: { id },
        });
        if (!eventExists) {
            return res.status(404).json({ message: "Event not found." });
        }
        await prisma_1.prisma.event.delete({
            where: { id },
        });
        const requestUserId = getRequestUserId(req);
        await (0, log_service_1.createActionLog)({
            userId: requestUserId,
            action: "EVENT_DELETED",
            entityType: "Event",
            entityId: id,
            information: `Deleted event "${eventExists.title}".`,
            ipAddress: req.ip,
        });
        if (requestUserId) {
            await (0, suspicious_service_1.analyzeUserForSuspiciousBehavior)(requestUserId);
        }
        return res.json({ message: "Event deleted successfully." });
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to delete event.",
            error,
        });
    }
};
exports.deleteEvent = deleteEvent;
