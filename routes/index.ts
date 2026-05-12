import express from "express";
const router = express.Router();
import { verifyToken } from "../middleware/auth";
const userRoutes = require("./users");
const flashcardRoutes = require("./flashcards");

router.use("/users", userRoutes);
router.use("/flashcards", verifyToken, flashcardRoutes);

module.exports = router;
