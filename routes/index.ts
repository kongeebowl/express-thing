import express from "express";
const router = express.Router();
import { verifyToken } from "../middleware/auth";
const userRoutes = require("./users");
const flashcardRoutes = require("./flashcards");
const uploadRoutes = require("./upload");
const authRoutes = require("./auth");
const adminRoutes = require("./admin");

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication endpoints
 *   - name: Users
 *     description: User management endpoints
 *   - name: Flashcards
 *     description: Flashcard CRUD operations
 *   - name: Upload
 *     description: File upload endpoints
 */

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/flashcards", verifyToken, flashcardRoutes);
router.use("/upload", verifyToken, uploadRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
