"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
const events_memory_1 = require("../src/data/events.memory");
describe("Stats API", () => {
    beforeEach(() => {
        (0, events_memory_1.resetEvents)();
    });
    describe("GET /stats/categories", () => {
        it("should return category stats", async () => {
            const response = await (0, supertest_1.default)(app_1.default).get("/stats/categories");
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0]).toHaveProperty("category");
            expect(response.body[0]).toHaveProperty("count");
        });
    });
    describe("GET /stats/pricing", () => {
        it("should return pricing stats", async () => {
            const response = await (0, supertest_1.default)(app_1.default).get("/stats/pricing");
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            const names = response.body.map((item) => item.name);
            expect(names).toContain("Free");
            expect(names).toContain("Paid");
        });
    });
    describe("GET /stats/comments", () => {
        it("should return comment statistics", async () => {
            const response = await (0, supertest_1.default)(app_1.default).get("/stats/comments");
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("totalComments");
            expect(response.body).toHaveProperty("commentsByEvent");
            expect(response.body).toHaveProperty("mostCommentedEvents");
            expect(response.body).toHaveProperty("commentsByUser");
            expect(Array.isArray(response.body.commentsByEvent)).toBe(true);
            expect(Array.isArray(response.body.mostCommentedEvents)).toBe(true);
            expect(Array.isArray(response.body.commentsByUser)).toBe(true);
            if (response.body.commentsByEvent.length > 0) {
                expect(response.body.commentsByEvent[0]).toHaveProperty("eventId");
                expect(response.body.commentsByEvent[0]).toHaveProperty("eventTitle");
                expect(response.body.commentsByEvent[0]).toHaveProperty("commentCount");
            }
            if (response.body.mostCommentedEvents.length > 0) {
                expect(response.body.mostCommentedEvents[0]).toHaveProperty("eventId");
                expect(response.body.mostCommentedEvents[0]).toHaveProperty("eventTitle");
                expect(response.body.mostCommentedEvents[0]).toHaveProperty("category");
                expect(response.body.mostCommentedEvents[0]).toHaveProperty("commentCount");
            }
            if (response.body.commentsByUser.length > 0) {
                expect(response.body.commentsByUser[0]).toHaveProperty("userId");
                expect(response.body.commentsByUser[0]).toHaveProperty("userName");
                expect(response.body.commentsByUser[0]).toHaveProperty("commentCount");
            }
        });
    });
});
