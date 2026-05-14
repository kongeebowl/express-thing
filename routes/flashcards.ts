import express from "express";
const router = express.Router();
const flashcardController = require("../controllers/flashcardController");
import { verifyToken } from "../middleware/auth";
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
 */
router.get("/:id", verifyToken, flashcardController.find);

/**
 * @swagger
 * /flashcards/{id}:
 *   put:
 *     summary: Update a flashcard
 *     description: Updates a flashcard by ID with new question/answer (must be owned by the user). Question and answer must be 1-1000 characters.
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
 *                 description: The question (1-1000 characters)
 *               answer:
 *                 type: string
 *                 description: The answer (1-1000 characters)
 *               imageUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Flashcard updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Flashcard'
 *       400:
 *         description: Validation error - invalid field lengths or no fields provided
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
 *     description: Creates a new flashcard for the authenticated user. Question and answer must be 1-1000 characters.
 *     tags:
 *       - Flashcards
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *                 description: The question (1-1000 characters)
 *               answer:
 *                 type: string
 *                 description: The answer (1-1000 characters)
 *             required:
 *               - question
 *               - answer
 *     responses:
 *       201:
 *         description: Flashcard created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Flashcard'
 *       400:
 *         description: Validation error - missing or invalid fields
 *       500:
 *         description: Failed to create flashcard
 */
router.post(
  "/",
  verifyToken,
  validateCreateFlashcard,
  flashcardController.create,
);

/**
 * @swagger
 * /flashcards/{id}:
 *   delete:
 *     summary: Delete a flashcard
 *     description: Deletes a flashcard by ID (must be owned by the user)
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
 *       201:
 *         description: Flashcard deleted successfully
 *       403:
 *         description: Unauthorized - you do not own this flashcard
 *       404:
 *         description: Flashcard not found
 *       400:
 *         description: Failed to delete flashcard
 */
router.delete("/:id", verifyToken, flashcardController.destroy);

module.exports = router;
