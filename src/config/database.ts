import mongoose from "mongoose";
import { env } from "./env";
export const connectDB = async (): Promise<void> => {
    try {
        mongoose.set("strictQuery", true);
        await mongoose.connect(env.mongodb.uri, {
            dbName: "fashion-store",
        });
        console.log("MongoDB connected successfully");
        mongoose.connection.on("error", (err) => {
            console.log("MongoDB connection error:", err);
        })
        mongoose.connection.on("disconnected", () => {
            console.warn("Mongo disconnected");
        })
    } catch (err) {
        console.error("MongoDB connection failed:", err);
        process.exit(1);
    }
};