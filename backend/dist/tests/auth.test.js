"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
require("./setupDatabase");
describe("Auth API", () => {
    describe("POST /auth/login", () => {
        it("should login admin and return user with JWT token", async () => {
            const response = await (0, supertest_1.default)(app_1.default).post("/auth/login").send({
                email: "admin@test.com",
                password: "admin123",
            });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("user");
            expect(response.body).toHaveProperty("token");
            expect(response.body.user).toHaveProperty("id", 1);
            expect(response.body.user).toHaveProperty("email", "admin@test.com");
            expect(response.body.user.roles).toContain("ADMIN");
            expect(response.body.user.permissions).toContain("events:create");
            expect(typeof response.body.token).toBe("string");
            expect(response.body.token.length).toBeGreaterThan(20);
        });
        it("should fail login with wrong password", async () => {
            const response = await (0, supertest_1.default)(app_1.default).post("/auth/login").send({
                email: "admin@test.com",
                password: "wrongpassword",
            });
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty("message", "Invalid email or password.");
        });
        it("should fail login with unknown email", async () => {
            const response = await (0, supertest_1.default)(app_1.default).post("/auth/login").send({
                email: "unknown@test.com",
                password: "user123",
            });
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty("message", "Invalid email or password.");
        });
        it("should fail login when email or password is missing", async () => {
            const response = await (0, supertest_1.default)(app_1.default).post("/auth/login").send({
                email: "admin@test.com",
            });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("message", "Email and password are required.");
        });
    });
    describe("POST /auth/register", () => {
        it("should register a new user and return user with JWT token", async () => {
            const response = await (0, supertest_1.default)(app_1.default).post("/auth/register").send({
                name: "Test Register User",
                email: "register-user@test.com",
                password: "user123",
            });
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("user");
            expect(response.body).toHaveProperty("token");
            expect(response.body.user).toHaveProperty("email", "register-user@test.com");
            expect(response.body.user.roles).toContain("USER");
            expect(response.body.user.permissions).toContain("events:read");
            expect(response.body.user.permissions).not.toContain("events:create");
            expect(typeof response.body.token).toBe("string");
            expect(response.body.token.length).toBeGreaterThan(20);
        });
        it("should fail register when email already exists", async () => {
            const response = await (0, supertest_1.default)(app_1.default).post("/auth/register").send({
                name: "Duplicate User",
                email: "admin@test.com",
                password: "user123",
            });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("message", "An account with this email already exists.");
        });
        it("should fail register when password is too short", async () => {
            const response = await (0, supertest_1.default)(app_1.default).post("/auth/register").send({
                name: "Short Password User",
                email: "short-password@test.com",
                password: "123",
            });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("message", "Password must have at least 6 characters.");
        });
        it("should fail register when required fields are missing", async () => {
            const response = await (0, supertest_1.default)(app_1.default).post("/auth/register").send({
                email: "missing-name@test.com",
                password: "user123",
            });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("message", "Name, email and password are required.");
        });
    });
});
