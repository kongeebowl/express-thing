import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import { currentUser } from "./middleware/currentUser.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(currentUser);

const flashcardsRoutes = await import("./routes/flashcards.js");
app.use("/flashcards", flashcardsRoutes);

const userRoutes = await import("./routes/users.js");
app.use("/users", userRoutes);

mongoose.connect(process.env.MONGO_URI ?? "").catch((err) => {
  console.error("kaboom!", err);
});

mongoose.connection.once("open", async () => {
  console.log(
    "I HATE THERSE STUPID ESM AND CJS AWEOPIHAOIWEHAOIEWHOAIWEHOIAWEHIO",
  );
  app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`);
  });
});
