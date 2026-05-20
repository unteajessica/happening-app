import mongoose, { Schema, Document, Model } from "mongoose";

export type ChatMessageDocument = Document & {
    roomId: string;
    userId: number;
    userName: string;
    message: string;
    createdAt: Date;
};

const chatMessageSchema = new Schema<ChatMessageDocument>(
    {
        roomId: {
            type: String,
            required: true,
            default: "global",
            trim: true,
        },
        userId: {
            type: Number,
            required: true,
        },
        userName: {
            type: String,
            required: true,
            trim: true,
        },
        message: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        collection: "chat_messages",
    }
);

export const ChatMessage: Model<ChatMessageDocument> =
    mongoose.models.ChatMessage ||
    mongoose.model<ChatMessageDocument>("ChatMessage", chatMessageSchema);