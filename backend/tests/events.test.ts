import request from "supertest";
import app from "../src/app";
import { resetEvents } from "../src/data/events.memory";

describe("Events API", () => {
    beforeEach(() => {
        resetEvents();
    });

    describe("GET /events", () => {
        it("should return all events with pagination info", async () => {
            const response = await request(app).get("/events?page=1&limit=10");

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("items");
            expect(response.body).toHaveProperty("page");
            expect(response.body).toHaveProperty("limit");
            expect(response.body).toHaveProperty("total");
            expect(response.body).toHaveProperty("totalPages");
            expect(Array.isArray(response.body.items)).toBe(true);
            expect(response.body.items.length).toBeGreaterThan(0);
        });
    });

    describe("GET /events/:id", () => {
        it("should return one event when id exists", async () => {
            const response = await request(app).get("/events/1");

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("id", 1);
            expect(response.body).toHaveProperty("title", "Jazz In The Park");
        });

        it("should return 404 when id does not exist", async () => {
            const response = await request(app).get("/events/999");

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty("message", "Event not found.");
        });
    });

    describe("POST /events", () => {
        it("should create a new event with valid data", async () => {
            const newEvent = {
                title: "Book Fair 2",
                category: "Exhibition",
                date: "15-07-2026",
                location: "City Hall",
                price: "Free",
                description: "A fair with books, talks, and local publishers.",
                imageUrl: "https://example.com/bookfair.jpg"
            };

            const response = await request(app).post("/events").send(newEvent);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("id");
            expect(response.body).toHaveProperty("title", "Book Fair 2");
        });

        it("should return 400 when a required field is missing", async () => {
            const invalidEvent = {
                title: "",
                category: "Exhibition",
                date: "15-07-2026",
                location: "City Hall",
                price: "Free",
                description: "A fair with books.",
                imageUrl: "https://example.com/bookfair.jpg"
            };

            const response = await request(app).post("/events").send(invalidEvent);

            expect(response.status).toBe(400);
        });

        it("should return 400 when title already exists", async () => {
            const duplicateEvent = {
                title: "Jazz In The Park",
                category: "Music",
                date: "22-07-2026",
                location: "Another Park",
                price: "$30",
                description: "Duplicate title test.",
                imageUrl: "https://example.com/jazz.jpg"
            };

            const response = await request(app).post("/events").send(duplicateEvent);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("message", "This title already exists.");
        });
    });

    describe("PUT /events/:id", () => {
        it("should update an existing event", async () => {
            const updatedEvent = {
                title: "Jazz In The Park Updated",
                category: "Music",
                date: "21-05-2026",
                location: "Central Park",
                price: "$25",
                description: "Updated description.",
                imageUrl: "https://example.com/jazz-updated.jpg"
            };

            const response = await request(app).put("/events/1").send(updatedEvent);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("id", 1);
            expect(response.body).toHaveProperty("title", "Jazz In The Park Updated");
            expect(response.body).toHaveProperty("price", "$25");
        });

        it("should return 404 when trying to update a missing event", async () => {
            const updatedEvent = {
                title: "Missing Event",
                category: "Music",
                date: "21-05-2026",
                location: "Central Park",
                price: "$25",
                description: "Updated description.",
                imageUrl: "https://example.com/jazz-updated.jpg"
            };

            const response = await request(app).put("/events/999").send(updatedEvent);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty("message", "Event not found.");
        });

        it("should return 400 when updated title duplicates another event", async () => {
            const updatedEvent = {
                title: "Untold",
                category: "Music",
                date: "21-05-2026",
                location: "Central Park",
                price: "$25",
                description: "Duplicate update test.",
                imageUrl: "https://example.com/jazz-updated.jpg"
            };

            const response = await request(app).put("/events/1").send(updatedEvent);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("message", "This title already exists.");
        });
    });

    describe("DELETE /events/:id", () => {
        it("should delete an existing event", async () => {
            const response = await request(app).delete("/events/1");

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("message", "Event deleted successfully.");
        });

        it("should return 404 when trying to delete a missing event", async () => {
            const response = await request(app).delete("/events/999");

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty("message", "Event not found.");
        });
    });
});