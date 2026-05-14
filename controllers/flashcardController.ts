import type { Request, Response } from "express";
const streamifier = require("streamifier");
import { cloudinary } from "../config/cloudinary";
import { Flashcard } from "../models/flashcard";

/**
 * @swagger
 * tags:
 *   name: Flashcards
 *   description: Flashcard management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Flashcard:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         question:
 *           type: string
 *         answer:
 *           type: string
 *         imageUrl:
 *           type: string
 *           nullable: true
 *         userId:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateFlashcard:
 *       type: object
 *       required:
 *         - question
 *         - answer
 *       properties:
 *         question:
 *           type: string
 *         answer:
 *           type: string
 *         image:
 *           type: string
 *           format: binary
 */

/**
 * @swagger
 * /flashcards:
 *   get:
 *     summary: Get all flashcards for the authenticated user
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of flashcards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Flashcard'
 *       500:
 *         description: Failed to fetch flashcards
 */
async function index(req: Request, res: Response) {
  try {
    const flashcards = await Flashcard.find({
      userId: (req as any).currentUser.id,
    }).populate("userId");

    res.status(200).send(flashcards);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch flashcards" });
  }
}

/**
 * @swagger
 * /flashcards:
 *   post:
 *     summary: Create a new flashcard
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateFlashcard'
 *     responses:
 *       201:
 *         description: Flashcard created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Flashcard'
 *       400:
 *         description: Failed to create flashcard
 *       401:
 *         description: Unauthorized
 */
async function create(req: any, res: any) {
  try {
    const userId = req.currentUser?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    let imageUrl: string | null = null;

    if (req.file) {
      const uploadResult = await new Promise<{ secure_url: string }>(
        (resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) => {
              if (error || !result) {
                return reject(error);
              }

              resolve(result as { secure_url: string });
            },
          );

          streamifier.createReadStream(req.file.buffer).pipe(stream);
        },
      );

      imageUrl = uploadResult.secure_url;
    }

    const flashcard = await Flashcard.create({
      question: req.body.question,
      answer: req.body.answer,
      userId,
      imageUrl,
    });

    return res.status(201).json(flashcard);
  } catch (err) {
    console.log(err);

    return res.status(400).json({
      error: "Failed to create flashcard",
    });
  }
}

/**
 * @swagger
 * /flashcards/{id}:
 *   delete:
 *     summary: Delete a flashcard by ID
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Flashcard ID
 *     responses:
 *       200:
 *         description: Flashcard deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Flashcard not found
 *       400:
 *         description: Failed to delete flashcard
 */
async function destroy(req: Request, res: Response) {
  try {
    const flashcard = await Flashcard.findById(req.params.id);

    if (!flashcard) {
      return res.status(404).send({ error: "Flashcard not found" });
    }

    if (flashcard.userId !== (req as any).currentUser!.id) {
      return res.status(403).send({ error: "Forbidden" });
    }

    await flashcard.deleteOne();

    return res.status(200).json({
      message: "Flashcard deleted successfully",
    });
  } catch (err) {
    return res.status(400).send({ error: "Failed to delete flashcard" });
  }
}

/**
 * @swagger
 * /flashcards/{id}:
 *   get:
 *     summary: Get a flashcard by ID
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Flashcard ID
 *     responses:
 *       200:
 *         description: Flashcard retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Flashcard'
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Flashcard not found
 *       400:
 *         description: Failed to retrieve flashcard
 */
async function find(req: Request, res: Response) {
  try {
    const flashcard = await Flashcard.findById(req.params.id);

    if (!flashcard) {
      return res.status(404).json({
        error: "Flashcard not found",
      });
    }

    if (flashcard.userId !== (req as any).currentUser!.id) {
      return res.status(403).json({
        error: "Forbidden",
      });
    }

    return res.status(200).json(flashcard);
  } catch (error) {
    return res.status(400).json({
      error: "Failed to retrieve flashcard",
    });
  }
}

/**
 * @swagger
 * /flashcards/{id}:
 *   put:
 *     summary: Update a flashcard by ID
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Flashcard ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               answer:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Flashcard updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Flashcard'
 *       404:
 *         description: Flashcard not found
 *       500:
 *         description: Failed to update flashcard
 */
async function update(req: Request, res: Response) {
  try {
    const flashcard = await Flashcard.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      },
    );

    if (!flashcard) {
      return res.status(404).json({
        error: "Flashcard not found",
      });
    }

    return res.status(200).json(flashcard);
  } catch (err) {
    return res.status(500).send({
      error: "Failed to update flashcard",
    });
  }
}

module.exports = { index, create, destroy, find, update };
