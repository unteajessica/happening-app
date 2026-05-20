import request from "supertest";
import app from "../src/app";
import "./setupDatabase";

let userToken: string;
let adminToken: string;

beforeAll(async () => {
    const userLogin = await request(app).post("/auth/login").send({
        email: "user@test.com",
        password: "user123",
    });

    userToken = userLogin.body.token;

    const adminLogin = await request(app).post("/auth/login").send({
        email: "admin@test.com",
        password: "admin123",
    });

    adminToken = adminLogin.body.token;
});

describe("Comments API", () => {
    describe("GET /comments/event/:eventId", () => {
        test("should return comments for an existing event", async () => {
            const response = await request(app).get("/comments/event/1");

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);

            if (response.body.length > 0) {
                expect(response.body[0]).toHaveProperty("id");
                expect(response.body[0]).toHaveProperty("eventId", 1);
                expect(response.body[0]).toHaveProperty("author");
                expect(response.body[0]).toHaveProperty("message");
                expect(response.body[0]).toHaveProperty("createdAt");
            }
        });

        test("should return 404 for comments of a missing event", async () => {
            const response = await request(app).get("/comments/event/999999");

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty("message", "Event not found.");
        });
    });

    describe("POST /comments", () => {
        test("should create a comment with valid data when user is authenticated", async () => {
            const response = await request(app)
                .post("/comments")
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    eventId: 1,
                    author: "Test Author",
                    message: "This is a test comment.",
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("id");
            expect(response.body).toHaveProperty("eventId", 1);
            expect(response.body).toHaveProperty("author", "Regular User");
            expect(response.body).toHaveProperty(
                "message",
                "This is a test comment."
            );
        });

        test("should return 401 when creating comment without token", async () => {
            const response = await request(app).post("/comments").send({
                eventId: 1,
                author: "Test Author",
                message: "This should fail without token.",
            });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty(
                "message",
                "Authorization token is required."
            );
        });

        test("should return 400 for invalid comment data", async () => {
            const response = await request(app)
                .post("/comments")
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    eventId: 1,
                    author: "",
                    message: "",
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("validationErrors");
        });

        test("should return 404 when creating comment for missing event", async () => {
            const response = await request(app)
                .post("/comments")
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    eventId: 999999,
                    author: "Test Author",
                    message: "This event does not exist.",
                });

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty("message", "Event not found.");
        });
    });

    describe("DELETE /comments/:commentId", () => {
        test("should delete an existing comment when admin is authenticated", async () => {
            const created = await request(app)
                .post("/comments")
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    eventId: 1,
                    author: "Delete Test",
                    message: "This comment will be deleted.",
                });

            expect(created.status).toBe(201);

            const response = await request(app)
                .delete(`/comments/${created.body.id}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty(
                "message",
                "Comment deleted successfully."
            );
        });

        test("should return 401 when deleting comment without token", async () => {
            const response = await request(app).delete("/comments/1");

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty(
                "message",
                "Authorization token is required."
            );
        });

        test("should return 403 when normal user tries to delete a comment", async () => {
            const response = await request(app)
                .delete("/comments/1")
                .set("Authorization", `Bearer ${userToken}`);

            expect(response.status).toBe(403);
            expect(response.body).toHaveProperty(
                "message",
                "You do not have permission to perform this action."
            );
        });

        test("should return 404 when deleting a missing comment", async () => {
            const response = await request(app)
                .delete("/comments/999999")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty("message", "Comment not found.");
        });
    });
});