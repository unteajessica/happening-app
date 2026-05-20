import request from "supertest";
import app from "../src/app";

describe("Categories API", () => {
    describe("GET /categories", () => {
        test("should return all categories", async () => {
            const response = await request(app).get("/categories");

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);

            expect(response.body[0]).toHaveProperty("id");
            expect(response.body[0]).toHaveProperty("name");
        });
    });

    describe("GET /categories/:id", () => {
        test("should return category by id", async () => {
            const categories = await request(app).get("/categories");
            const categoryId = categories.body[0].id;

            const response = await request(app).get(`/categories/${categoryId}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("id", categoryId);
            expect(response.body).toHaveProperty("name");
            expect(response.body).toHaveProperty("events");
        });

        test("should return 404 for missing category", async () => {
            const response = await request(app).get("/categories/999999");

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty("message", "Category not found.");
        });
    });

    describe("POST /categories", () => {
        test("should create a category", async () => {
            const response = await request(app).post("/categories").send({
                name: `Test Category ${Date.now()}`,
                description: "Created during test",
            });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("id");
            expect(response.body).toHaveProperty("name");
            expect(response.body).toHaveProperty("description", "Created during test");
        });
    });

    describe("PUT /categories/:id", () => {
        test("should update a category", async () => {
            const created = await request(app).post("/categories").send({
                name: `Update Category ${Date.now()}`,
                description: "Before update",
            });

            expect(created.status).toBe(201);

            const response = await request(app)
                .put(`/categories/${created.body.id}`)
                .send({
                    name: `Updated Category ${Date.now()}`,
                    description: "After update",
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("id", created.body.id);
            expect(response.body).toHaveProperty("description", "After update");
        });
    });

    describe("DELETE /categories/:id", () => {
        test("should delete a category", async () => {
            const created = await request(app).post("/categories").send({
                name: `Delete Category ${Date.now()}`,
                description: "Will be deleted",
            });

            expect(created.status).toBe(201);

            const response = await request(app).delete(`/categories/${created.body.id}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty(
                "message",
                "Category deleted successfully."
            );
        });
    });
});