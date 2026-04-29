import request from "supertest";
import app from "../src/app";
import { resetEvents } from "../src/data/events.memory";

describe("Stats API", () => {
    beforeEach(() => {
        resetEvents();
    });

    describe("GET /stats/categories", () => {
        it("should return category stats", async () => {
            const response = await request(app).get("/stats/categories");

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);

            expect(response.body[0]).toHaveProperty("category");
            expect(response.body[0]).toHaveProperty("count");
        });
    });

    describe("GET /stats/pricing", () => {
        it("should return pricing stats", async () => {
            const response = await request(app).get("/stats/pricing");

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);

            const names = response.body.map((item: { name: string }) => item.name);
            expect(names).toContain("Free");
            expect(names).toContain("Paid");
        });
    });
});