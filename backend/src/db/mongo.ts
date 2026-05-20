import mongoose from "mongoose";

export async function connectMongo() {
    const mongoUrl = process.env.MONGO_URL;

    if (!mongoUrl) {
        throw new Error("MONGO_URL is missing from .env");
    }

    if (mongoose.connection.readyState === 1) {
        console.log("MongoDB already connected.");
        return;
    }

    await mongoose.connect(mongoUrl);

    console.log("MongoDB connected successfully.");
}