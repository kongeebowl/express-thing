import type { Request, Response } from "express";
const streamifier = require("streamifier");
import { cloudinary } from "../config/cloudinary";
import { Flashcard } from "../models/flashcard";

/**
 * Retrieves all flashcards for the authenticated user
 * @param {Request} req - Express request object with currentUser
 * @param {Response} res - Express response object
 * @returns {Promise<void>} JSON array of flashcards or error message
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
 * Creates a new flashcard for the authenticated user
 * @param {Request} req - Express request object with currentUser
 * @param {Response} res - Express response object
 * @returns {Promise<void>} Created flashcard or error message
 */
async function create(req: any, res: any) {
  try {
    const userId = (req as any).currentUser?.id;

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
      userId: userId,
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
 * Deletes a flashcard by ID (must be owned by user)
 * @param {Request} req - Express request object with flashcard ID and currentUser
 * @param {Response} res - Express response object
 * @returns {Promise<void>} Success or error message
 */
async function destroy(req: Request, res: Response) {
  try {
    const flashcard = await Flashcard.findById(req.params.id);
    if (!flashcard) {
      return res.status(404).send({ error: "Flashcard not found" });
    }

    if (flashcard.userId !== (req as any).currentUser!.id)
      res.status(403).send({ error: "you are wrong sir man" });

    await flashcard.deleteOne();
    res.status(201);
  } catch (err) {
    res.status(400).send({ error: "Failed to delete flashcard" });
  }
}

/**
 * Retrieves a single flashcard by ID (must be owned by user)
 * @param {Request} req - Express request object with flashcard ID and currentUser
 * @param {Response} res - Express response object
 * @returns {Promise<void>} Flashcard data or error message
 */
async function find(req: Request, res: Response) {
  try {
    const id = req.params;
    const flashcard = await Flashcard.findById(id);

    if (!flashcard)
      return res.status(404).json({ error: "flashcard not found" });
    if (flashcard.userId !== (req as any).currentUser!.id)
      return res.status(403).json({ error: "you are wrong person man sir" });
  } catch (error) {
    return res.status(400).json({ error: "something very very bad happened" });
  }
}

/**
 * Updates a flashcard by ID with new data
 * @param {Request} req - Express request object with flashcard ID and update data
 * @param {Response} res - Express response object
 * @returns {Promise<void>} Updated flashcard or error message
 */
async function update(req: Request, res: Response) {
  const id = req.params;
  try {
    const flashcard = await Flashcard.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.send(flashcard);
  } catch (err) {
    res.status(500).send(err);
  }
}

module.exports = { index, create, destroy, find, update };
