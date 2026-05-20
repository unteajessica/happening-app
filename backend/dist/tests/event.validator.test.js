"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const event_validator_1 = require("../src/validators/event.validator");
describe("validateEventInput", () => {
    const validInput = {
        title: "Backend Test Event",
        category: "Music",
        date: "31-12-2099",
        location: "Cluj Arena",
        price: "$20",
        imageUrl: "https://example.com/test.jpg",
        description: "A valid event description."
    };
    it("should return no errors for valid input", () => {
        const result = (0, event_validator_1.validateEventInput)(validInput);
        expect(result).toEqual({});
    });
    it("should return error when title is missing", () => {
        const result = (0, event_validator_1.validateEventInput)({ ...validInput, title: "" });
        expect(result.title).toBe("Title is required.");
    });
    it("should return error when category is missing", () => {
        const result = (0, event_validator_1.validateEventInput)({ ...validInput, category: "" });
        expect(result.category).toBe("Category is required.");
    });
    it("should return error when date is missing", () => {
        const result = (0, event_validator_1.validateEventInput)({ ...validInput, date: "" });
        expect(result.date).toBe("Date is required.");
    });
    it("should return error when location is missing", () => {
        const result = (0, event_validator_1.validateEventInput)({ ...validInput, location: "" });
        expect(result.location).toBe("Location is required.");
    });
    it("should return error when price is missing", () => {
        const result = (0, event_validator_1.validateEventInput)({ ...validInput, price: "" });
        expect(result.price).toBe("Price is required.");
    });
    it("should return error when imageUrl is missing", () => {
        const result = (0, event_validator_1.validateEventInput)({ ...validInput, imageUrl: "" });
        expect(result.imageUrl).toBe("Image URL is required.");
    });
    it("should return error when description is missing", () => {
        const result = (0, event_validator_1.validateEventInput)({ ...validInput, description: "" });
        expect(result.description).toBe("Description is required.");
    });
    it("should return error for invalid date format", () => {
        const result = (0, event_validator_1.validateEventInput)({ ...validInput, date: "2026-12-31" });
        expect(result.date).toBe("Date must be in format DD-MM-YYYY, for example 01-01-2026.");
    });
    it("should return error for invalid day in month", () => {
        const result = (0, event_validator_1.validateEventInput)({ ...validInput, date: "31-02-2099" });
        expect(result.date).toBe("Invalid day for the selected month and year.");
    });
    it("should return error for invalid month in date", () => {
        const result = (0, event_validator_1.validateEventInput)({ ...validInput, date: "10-13-2026" });
        expect(result.date).toBe("Month must be between 01 and 12.");
    });
    it("should return error for past date", () => {
        const result = (0, event_validator_1.validateEventInput)({ ...validInput, date: "01-01-2020" });
        expect(result.date).toBe("Date cannot be in the past.");
    });
});
