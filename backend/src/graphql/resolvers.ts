import { GraphQLError } from "graphql";
import { events, getNextEventId, replaceEvents } from "../data/events.memory";
import { comments, getNextCommentId, replaceComments } from "../data/comments.memory";
import type { EventInput, EventItem } from "../data/event";
import type { CommentInput, CommentItem } from "../data/comment";
import { validateEventInput } from "../validators/event.validator";
import { validateCommentInput } from "../validators/comment.validator";
import {
    startGenerator,
    stopGenerator,
    getGeneratorStatus,
} from "../services/generator.service";

export const resolvers = {
    Query: {
        events: (_: unknown, args: { page?: number; limit?: number }) => {
            const page = args.page ?? 1;
            const limit = args.limit ?? 6;

            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;

            const paginatedEvents = events.slice(startIndex, endIndex);

            return {
                items: paginatedEvents,
                page,
                limit,
                total: events.length,
                totalPages: Math.ceil(events.length / limit),
            };
        },

        event: (_: unknown, args: { id: number }) => {
            const event = events.find((e) => e.id === args.id);

            if (!event) {
                throw new GraphQLError("Event not found.");
            }

            return event;
        },

        comments: (_: unknown, args: { eventId: number }) => {
            const eventExists = events.some((event) => event.id === args.eventId);

            if (!eventExists) {
                throw new GraphQLError("Event not found.");
            }

            return comments
                .filter((comment) => comment.eventId === args.eventId)
                .sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                );
        },

        categoryStats: () => {
            const categoryMap = events.reduce((acc, event) => {
                acc[event.category] = (acc[event.category] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            return Object.entries(categoryMap).map(([category, count]) => ({
                category,
                count,
            }));
        },

        pricingStats: () => {
            const freeCount = events.filter((event) => event.price === "Free").length;
            const paidCount = events.length - freeCount;

            return [
                { name: "Paid", value: paidCount },
                { name: "Free", value: freeCount },
            ];
        },

        commentStats: () => {
            return events.map((event) => ({
                eventId: event.id,
                eventTitle: event.title,
                commentCount: comments.filter((comment) => comment.eventId === event.id)
                    .length,
            }));
        },

        generatorStatus: () => {
            return getGeneratorStatus();
        },
    },

    Mutation: {
        createEvent: (_: unknown, args: { input: EventInput }) => {
            const eventData: Partial<EventInput> = args.input;

            const validationErrors = validateEventInput(eventData);

            if (Object.keys(validationErrors).length > 0) {
                throw new GraphQLError(JSON.stringify(validationErrors));
            }

            const titleExists = events.some(
                (e) => e.title.toLowerCase() === eventData.title!.toLowerCase()
            );

            if (titleExists) {
                throw new GraphQLError("This title already exists.");
            }

            const newEvent: EventItem = {
                id: getNextEventId(),
                title: eventData.title!,
                category: eventData.category!,
                date: eventData.date!,
                location: eventData.location!,
                price: eventData.price!,
                description: eventData.description!,
                imageUrl: eventData.imageUrl!,
            };

            events.push(newEvent);

            return newEvent;
        },

        updateEvent: (_: unknown, args: { id: number; input: EventInput }) => {
            const eventIndex = events.findIndex((e) => e.id === args.id);

            if (eventIndex === -1) {
                throw new GraphQLError("Event not found.");
            }

            const eventData: Partial<EventInput> = args.input;

            const validationErrors = validateEventInput(eventData);

            if (Object.keys(validationErrors).length > 0) {
                throw new GraphQLError(JSON.stringify(validationErrors));
            }

            const duplicateTitle = events.some(
                (e) =>
                    e.id !== args.id &&
                    e.title.toLowerCase() === eventData.title!.toLowerCase()
            );

            if (duplicateTitle) {
                throw new GraphQLError("This title already exists.");
            }

            const updatedEvent: EventItem = {
                id: args.id,
                title: eventData.title!,
                category: eventData.category!,
                date: eventData.date!,
                location: eventData.location!,
                price: eventData.price!,
                description: eventData.description!,
                imageUrl: eventData.imageUrl!,
            };

            events[eventIndex] = updatedEvent;

            return updatedEvent;
        },

        deleteEvent: (_: unknown, args: { id: number }) => {
            const eventExists = events.some((e) => e.id === args.id);

            if (!eventExists) {
                throw new GraphQLError("Event not found.");
            }

            const updatedEvents = events.filter((e) => e.id !== args.id);
            const updatedComments = comments.filter(
                (comment) => comment.eventId !== args.id
            );

            replaceEvents(updatedEvents);
            replaceComments(updatedComments);

            return { message: "Event deleted successfully." };
        },

        createComment: (_: unknown, args: { input: CommentInput }) => {
            const commentData: Partial<CommentInput> = args.input;

            const validationErrors = validateCommentInput(commentData);

            if (Object.keys(validationErrors).length > 0) {
                throw new GraphQLError(JSON.stringify(validationErrors));
            }

            const eventExists = events.some(
                (event) => event.id === commentData.eventId
            );

            if (!eventExists) {
                throw new GraphQLError("Event not found.");
            }

            const newComment: CommentItem = {
                id: getNextCommentId(),
                eventId: commentData.eventId!,
                author: commentData.author!.trim(),
                message: commentData.message!.trim(),
                createdAt: new Date().toISOString(),
            };

            comments.push(newComment);

            return newComment;
        },

        deleteComment: (_: unknown, args: { commentId: number }) => {
            const commentExists = comments.some(
                (comment) => comment.id === args.commentId
            );

            if (!commentExists) {
                throw new GraphQLError("Comment not found.");
            }

            const updatedComments = comments.filter(
                (comment) => comment.id !== args.commentId
            );

            replaceComments(updatedComments);

            return { message: "Comment deleted successfully." };
        },

        startGenerator: () => {
            return startGenerator();
        },

        stopGenerator: () => {
            return stopGenerator();
        },
    },

    Event: {
        comments: (parent: EventItem) => {
            return comments.filter((comment) => comment.eventId === parent.id);
        },

        commentsCount: (parent: EventItem) => {
            return comments.filter((comment) => comment.eventId === parent.id).length;
        },
    },

    Comment: {
        event: (parent: CommentItem) => {
            const event = events.find((e) => e.id === parent.eventId);

            if (!event) {
                throw new GraphQLError("Event not found.");
            }

            return event;
        },
    },
};