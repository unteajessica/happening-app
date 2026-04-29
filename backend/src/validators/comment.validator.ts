import type { CommentInput } from "../data/comment";

export type CommentValidationErrors = {
    author?: string;
    message?: string;
    eventId?: string;
};

export function validateCommentInput(values: Partial<CommentInput>): CommentValidationErrors {
    const errors: CommentValidationErrors = {};

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