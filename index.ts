import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import { currentUser } from "./middleware/currentUser.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(currentUser);

const flashcardsRoutes = require("./routes/flashcards");
app.use("/flashcards", flashcardsRoutes);
// const authRoutes = require("./routes/auth");
// app.use("/auth", authRoutes);
const userRoutes = require("./routes/users");
app.use("/users", userRoutes);

mongoose.connect(process.env.MONGO_URI ?? "").catch((err) => {
  console.error("kaboom!", err);
});

mongoose.connection.once("open", async () => {
  console.log("the mongoose is loose");
  app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`);
  });
});
