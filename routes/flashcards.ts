import express from "express";
const router = express.Router();

const flashcardController = require("../controllers/flashcardController");

import { verifyToken } from "../middleware/auth";
import { upload } from "../middleware/multer";

import {
  validateCreateFlashcard,
  validateUpdateFlashcard,
} from "../middleware/validation";

/**
 * @swagger
 * /flashcards:
 *   get:
 *     summary: Get all flashcards for the current user
 *     description: Retrieves all flashcards associated with the authenticated user
 *     tags:
 *       - Flashcards
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of flashcards retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Flashcard'
 *       500:
 *         description: Failed to fetch flashcards
 */
router.get("/", verifyToken, flashcardController.index);

/**
 * @swagger
 * /flashcards/{id}:
 *   get:
 *     summary: Get a specific flashcard
 *     description: Retrieves a single flashcard by ID (must be owned by the user)
 *     tags:
 *       - Flashcards
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The flashcard ID
 *     responses:
 *       200:
 *         description: Flashcard retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Flashcard'
 *       403:
 *         description: Unauthorized - you do not own this flashcard
 *       404:
 *         description: Flashcard not found
 *       500:
 *         description: Failed to retrieve flashcard
 */
router.get("/:id", verifyToken, flashcardController.find);

/**
 * @swagger
 * /flashcards/{id}:
 *   put:
 *     summary: Update a flashcard
 *     description: Updates a flashcard by ID with new question and answer values
 *     tags:
 *       - Flashcards
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The flashcard ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 1000
 *               answer:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 1000
 *               imageUrl:
 *                 type: string
 *             required:
 *               - question
 *               - answer
 *     responses:
 *       200:
 *         description: Flashcard updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Flashcard'
 *       400:
 *         description: Validation error or invalid update data
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Flashcard not found
 *       500:
 *         description: Failed to update flashcard
 */
router.put(
  "/:id",
  verifyToken,
  validateUpdateFlashcard,
  flashcardController.update,
);

/**
 * @swagger
 * /flashcards:
 *   post:
 *     summary: Create a new flashcard
 *     description: Creates a new flashcard for the authenticated user with an optional image upload
 *     tags:
 *       - Flashcards
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *               - answer
 *             properties:
 *               question:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 1000
 *                 description: Flashcard question
 *               answer:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 1000
 *                 description: Flashcard answer
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Optional image upload
 *     responses:
 *       201:
 *         description: Flashcard created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Flashcard'
 *       400:
 *         description: Invalid request data or image upload failed
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to create flashcard
 */
router.post(
  "/",
  verifyToken,
  upload.single("file"),
  validateCreateFlashcard,
  flashcardController.create,
);

/**
 * @swagger
 * /flashcards/{id}:
 *   delete:
 *     summary: Delete a flashcard
 *     description: Deletes a flashcard owned by the authenticated user
 *     tags:
 *       - Flashcards
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The flashcard ID
 *     responses:
 *       204:
 *         description: Flashcard deleted successfully
 *       403:
 *         description: Unauthorized - you do not own this flashcard
 *       404:
 *         description: Flashcard not found
 *       500:
 *         description: Failed to delete flashcard
 */
router.delete("/:id", verifyToken, flashcardController.destroy);

module.exports = router;
