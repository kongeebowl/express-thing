import "dotenv/config";
import mongoose from "mongoose";

/**
 * MongoDB Connection Module
 * Establishes connection to MongoDB using MONGO_URI from environment variables
 */
if (process.env.MONGO_URI)
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("the mongoose is loose"))
    .catch((err: string) => console.error("Error connecting to MongoDB:", err));
