import "dotenv/config";
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("the mongoose is loose"))
  .catch((err: string) => console.error("Error connecting to MongoDB:", err));
