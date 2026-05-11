import express from "express";
const router = new express.Router();
const auth = await import("../middleware/auth.js");
const userRoutes = await import("./users.js");
const flashcardRoutes = await import("./flashcards.js");

router.use("/users", userRoutes);
router.use("/flashcards", auth, flashcardRoutes);

export { router };
