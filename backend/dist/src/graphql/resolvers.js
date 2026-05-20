"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const graphql_1 = require("graphql");
const events_memory_1 = require("../data/events.memory");
const comments_memory_1 = require("../data/comments.memory");
const event_validator_1 = require("../validators/event.validator");
const comment_validator_1 = require("../validators/comment.validator");
const generator_service_1 = require("../services/generator.service");
exports.resolvers = {
    Query: {
        events: (_, args) => {
            const page = args.page ?? 1;
            const limit = args.limit ?? 6;
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedEvents = events_memory_1.events.slice(startIndex, endIndex);
            return {
                items: paginatedEvents,
                page,
                limit,
                total: events_memory_1.events.length,
                totalPages: Math.ceil(events_memory_1.events.length / limit),
            };
        },
        event: (_, args) => {
            const event = events_memory_1.events.find((e) => e.id === args.id);
            if (!event) {
                throw new graphql_1.GraphQLError("Event not found.");
            }
            return event;
        },
        comments: (_, args) => {
            const eventExists = events_memory_1.events.some((event) => event.id === args.eventId);
            if (!eventExists) {
                throw new graphql_1.GraphQLError("Event not found.");
            }
            return comments_memory_1.comments
                .filter((comment) => comment.eventId === args.eventId)
                .sort((a, b) => new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime());
        },
        categoryStats: () => {
            const categoryMap = events_memory_1.events.reduce((acc, event) => {
                acc[event.category] = (acc[event.category] || 0) + 1;
                return acc;
            }, {});
            return Object.entries(categoryMap).map(([category, count]) => ({
                category,
                count,
            }));
        },
        pricingStats: () => {
            const freeCount = events_memory_1.events.filter((event) => event.price === "Free").length;
            const paidCount = events_memory_1.events.length - freeCount;
            return [
                { name: "Paid", value: paidCount },
                { name: "Free", value: freeCount },
            ];
        },
        commentStats: () => {
            return events_memory_1.events.map((event) => ({
                eventId: event.id,
                eventTitle: event.title,
                commentCount: comments_memory_1.comments.filter((comment) => comment.eventId === event.id)
                    .length,
            }));
        },
        generatorStatus: () => {
            return (0, generator_service_1.getGeneratorStatus)();
        },
    },
    Mutation: {
        createEvent: (_, args) => {
            const eventData = args.input;
            const validationErrors = (0, event_validator_1.validateEventInput)(eventData);
            if (Object.keys(validationErrors).length > 0) {
                throw new graphql_1.GraphQLError(JSON.stringify(validationErrors));
            }
            const titleExists = events_memory_1.events.some((e) => e.title.toLowerCase() === eventData.title.toLowerCase());
            if (titleExists) {
                throw new graphql_1.GraphQLError("This title already exists.");
            }
            const newEvent = {
                id: (0, events_memory_1.getNextEventId)(),
                title: eventData.title,
                category: eventData.category,
                date: eventData.date,
                location: eventData.location,
                price: eventData.price,
                description: eventData.description,
                imageUrl: eventData.imageUrl,
            };
            events_memory_1.events.push(newEvent);
            return newEvent;
        },
        updateEvent: (_, args) => {
            const eventIndex = events_memory_1.events.findIndex((e) => e.id === args.id);
            if (eventIndex === -1) {
                throw new graphql_1.GraphQLError("Event not found.");
            }
            const eventData = args.input;
            const validationErrors = (0, event_validator_1.validateEventInput)(eventData);
            if (Object.keys(validationErrors).length > 0) {
                throw new graphql_1.GraphQLError(JSON.stringify(validationErrors));
            }
            const duplicateTitle = events_memory_1.events.some((e) => e.id !== args.id &&
                e.title.toLowerCase() === eventData.title.toLowerCase());
            if (duplicateTitle) {
                throw new graphql_1.GraphQLError("This title already exists.");
            }
            const updatedEvent = {
                id: args.id,
                title: eventData.title,
                category: eventData.category,
                date: eventData.date,
                location: eventData.location,
                price: eventData.price,
                description: eventData.description,
                imageUrl: eventData.imageUrl,
            };
            events_memory_1.events[eventIndex] = updatedEvent;
            return updatedEvent;
        },
        deleteEvent: (_, args) => {
            const eventExists = events_memory_1.events.some((e) => e.id === args.id);
            if (!eventExists) {
                throw new graphql_1.GraphQLError("Event not found.");
            }
            const updatedEvents = events_memory_1.events.filter((e) => e.id !== args.id);
            const updatedComments = comments_memory_1.comments.filter((comment) => comment.eventId !== args.id);
            (0, events_memory_1.replaceEvents)(updatedEvents);
            (0, comments_memory_1.replaceComments)(updatedComments);
            return { message: "Event deleted successfully." };
        },
        createComment: (_, args) => {
            const commentData = args.input;
            const validationErrors = (0, comment_validator_1.validateCommentInput)(commentData);
            if (Object.keys(validationErrors).length > 0) {
                throw new graphql_1.GraphQLError(JSON.stringify(validationErrors));
            }
            const eventExists = events_memory_1.events.some((event) => event.id === commentData.eventId);
            if (!eventExists) {
                throw new graphql_1.GraphQLError("Event not found.");
            }
            const newComment = {
                id: (0, comments_memory_1.getNextCommentId)(),
                eventId: commentData.eventId,
                author: commentData.author.trim(),
                message: commentData.message.trim(),
                createdAt: new Date().toISOString(),
            };
            comments_memory_1.comments.push(newComment);
            return newComment;
        },
        deleteComment: (_, args) => {
            const commentExists = comments_memory_1.comments.some((comment) => comment.id === args.commentId);
            if (!commentExists) {
                throw new graphql_1.GraphQLError("Comment not found.");
            }
            const updatedComments = comments_memory_1.comments.filter((comment) => comment.id !== args.commentId);
            (0, comments_memory_1.replaceComments)(updatedComments);
            return { message: "Comment deleted successfully." };
        },
        startGenerator: () => {
            return (0, generator_service_1.startGenerator)();
        },
        stopGenerator: () => {
            return (0, generator_service_1.stopGenerator)();
        },
    },
    Event: {
        comments: (parent) => {
            return comments_memory_1.comments.filter((comment) => comment.eventId === parent.id);
        },
        commentsCount: (parent) => {
            return comments_memory_1.comments.filter((comment) => comment.eventId === parent.id).length;
        },
    },
    Comment: {
        event: (parent) => {
            const event = events_memory_1.events.find((e) => e.id === parent.eventId);
            if (!event) {
                throw new graphql_1.GraphQLError("Event not found.");
            }
            return event;
        },
    },
};
