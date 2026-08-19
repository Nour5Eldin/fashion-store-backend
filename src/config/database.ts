import mongoose from "mongoose";
import { env } from "./env";

let isConnected = false;

export const connectDB = async (): Promise<void> => {
    if (isConnected || mongoose.connection.readyState >= 1) {
        return;
    }

    try {
        mongoose.set("strictQuery", true);

        if (mongoose.connection.listeners("error").length === 0) {
            mongoose.connection.on("error", (err) => {
                console.error("MongoDB connection error:", err);
            });
            mongoose.connection.on("disconnected", () => {
                console.warn("MongoDB disconnected");
                isConnected = false;
            });
        }

        const db = await mongoose.connect(env.mongodb.uri, {
            dbName: "fashion-store",
            serverSelectionTimeoutMS: 5000,
        });

        isConnected = !!db.connections[0].readyState;
        console.log("🍃 MongoDB connected successfully");

    } catch (err) {
        console.error("MongoDB connection failed:", err);
        isConnected = false;

        if (process.env.NODE_ENV === "production") {
            throw err;
        } else {
            process.exit(1);
        }
    }
};