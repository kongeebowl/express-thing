import "dotenv/config";
import mongoose from "mongoose";

if (process.env.MONGO_URI)
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("the mongoose is loose"))
    .catch((err: string) => console.error("Error connecting to MongoDB:", err));
