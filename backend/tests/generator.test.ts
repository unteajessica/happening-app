import request from "supertest";
import app from "../src/app";

describe("Generator API", () => {
    test("should return generator status", async () => {
        const response = await request(app).get("/generator/status");

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("isRunning");
        expect(typeof response.body.isRunning).toBe("boolean");
    });

    test("should start generator", async () => {
        const response = await request(app).post("/generator/start");

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message");
    });

    test("should stop generator", async () => {
        const response = await request(app).post("/generator/stop");

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message");
    });
});