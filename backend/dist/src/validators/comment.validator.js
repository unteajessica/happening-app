"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCommentInput = validateCommentInput;
function validateCommentInput(values) {
    const errors = {};
    if (!values.eventId || Number.isNaN(Number(values.eventId))) {
        errors.eventId = "Valid eventId is required.";
    }
    if (!values.author || !values.author.trim()) {
        errors.author = "Author is required.";
    }
    if (!values.message || !values.message.trim()) {
        errors.message = "Message is required.";
    }
    return errors;
}
