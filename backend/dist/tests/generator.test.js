"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
describe("Generator API", () => {
    test("should return generator status", async () => {
        const response = await (0, supertest_1.default)(app_1.default).get("/generator/status");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("isRunning");
        expect(typeof response.body.isRunning).toBe("boolean");
    });
    test("should start generator", async () => {
        const response = await (0, supertest_1.default)(app_1.default).post("/generator/start");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message");
    });
    test("should stop generator", async () => {
        const response = await (0, supertest_1.default)(app_1.default).post("/generator/stop");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message");
    });
});
