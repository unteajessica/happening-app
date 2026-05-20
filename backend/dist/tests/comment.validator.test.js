"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const comment_validator_1 = require("../src/validators/comment.validator");
describe("Comment validator", () => {
    test("should return no errors for valid comment input", () => {
        const result = (0, comment_validator_1.validateCommentInput)({
            eventId: 1,
            author: "John",
            message: "This is a valid comment.",
        });
        expect(result).toEqual({});
    });
    test("should return errors when all fields are missing", () => {
        const result = (0, comment_validator_1.validateCommentInput)({});
        expect(result).toHaveProperty("eventId", "Valid eventId is required.");
        expect(result).toHaveProperty("author", "Author is required.");
        expect(result).toHaveProperty("message", "Message is required.");
    });
    test("should return error when eventId is invalid", () => {
        const result = (0, comment_validator_1.validateCommentInput)({
            eventId: Number.NaN,
            author: "John",
            message: "Hello",
        });
        expect(result).toHaveProperty("eventId", "Valid eventId is required.");
    });
    test("should return error when author is empty", () => {
        const result = (0, comment_validator_1.validateCommentInput)({
            eventId: 1,
            author: "   ",
            message: "Hello",
        });
        expect(result).toHaveProperty("author", "Author is required.");
    });
    test("should return error when message is empty", () => {
        const result = (0, comment_validator_1.validateCommentInput)({
            eventId: 1,
            author: "John",
            message: "   ",
        });
        expect(result).toHaveProperty("message", "Message is required.");
    });
});
