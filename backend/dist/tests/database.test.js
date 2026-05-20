"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../src/db/prisma");
describe("Database implementation", () => {
    afterAll(async () => {
        await prisma_1.prisma.$disconnect();
    });
    test("should create, read, update and delete an event", async () => {
        const user = await prisma_1.prisma.user.findFirst();
        const category = await prisma_1.prisma.category.findFirst();
        expect(user).not.toBeNull();
        expect(category).not.toBeNull();
        const createdEvent = await prisma_1.prisma.event.create({
            data: {
                title: "Jest Test Event",
                description: "Created during automated test",
                date: new Date("2026-08-01T12:00:00"),
                location: "Test Location",
                price: 10,
                imageUrl: "https://example.com/test.jpg",
                categoryId: category.id,
                createdById: user.id,
            },
        });
        expect(createdEvent.title).toBe("Jest Test Event");
        const foundEvent = await prisma_1.prisma.event.findUnique({
            where: { id: createdEvent.id },
        });
        expect(foundEvent).not.toBeNull();
        const updatedEvent = await prisma_1.prisma.event.update({
            where: { id: createdEvent.id },
            data: {
                title: "Updated Jest Test Event",
            },
        });
        expect(updatedEvent.title).toBe("Updated Jest Test Event");
        await prisma_1.prisma.event.delete({
            where: { id: createdEvent.id },
        });
        const deletedEvent = await prisma_1.prisma.event.findUnique({
            where: { id: createdEvent.id },
        });
        expect(deletedEvent).toBeNull();
    });
    test("should create, read, update and delete a comment", async () => {
        const user = await prisma_1.prisma.user.findFirst();
        const event = await prisma_1.prisma.event.findFirst();
        expect(user).not.toBeNull();
        expect(event).not.toBeNull();
        const createdComment = await prisma_1.prisma.comment.create({
            data: {
                content: "Jest test comment",
                userId: user.id,
                eventId: event.id,
            },
        });
        expect(createdComment.content).toBe("Jest test comment");
        const foundComment = await prisma_1.prisma.comment.findUnique({
            where: { id: createdComment.id },
        });
        expect(foundComment).not.toBeNull();
        const updatedComment = await prisma_1.prisma.comment.update({
            where: { id: createdComment.id },
            data: {
                content: "Updated Jest test comment",
            },
        });
        expect(updatedComment.content).toBe("Updated Jest test comment");
        await prisma_1.prisma.comment.delete({
            where: { id: createdComment.id },
        });
        const deletedComment = await prisma_1.prisma.comment.findUnique({
            where: { id: createdComment.id },
        });
        expect(deletedComment).toBeNull();
    });
    test("should return basic statistics", async () => {
        const usersCount = await prisma_1.prisma.user.count();
        const categoriesCount = await prisma_1.prisma.category.count();
        const eventsCount = await prisma_1.prisma.event.count();
        const commentsCount = await prisma_1.prisma.comment.count();
        expect(usersCount).toBeGreaterThanOrEqual(0);
        expect(categoriesCount).toBeGreaterThanOrEqual(0);
        expect(eventsCount).toBeGreaterThanOrEqual(0);
        expect(commentsCount).toBeGreaterThanOrEqual(0);
    });
});
