import type { Request, Response } from "express";
import { Types } from "mongoose";
import { Flashcard } from "../models/flashcardModel.js";
import User from "../models/userModel.js";
import {
  getPaginationOptions,
  createPaginatedResponse,
} from "../utils/pagination.js";
import { validateFlashcard } from "../utils/validators.js";

interface AuthRequest extends Request {
  userId?: string;
}

async function index(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId;

    if (!userId || !Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "USER_NOT_FOUND" });
      return;
    }

    const { page, limit } = getPaginationOptions(req.query);
    const skip = (page - 1) * limit;

    const [flashcards, total] = await Promise.all([
      Flashcard.find({ userId })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Flashcard.countDocuments({ userId }),
    ]);

    const paginatedResponse = createPaginatedResponse(
      flashcards,
      total,
      page,
      limit,
    );
    res.json(paginatedResponse);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message || "Failed to fetch flashcards" });
  }
}

async function show(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId;
    const { cardId } = req.params;

    if (!cardId || !Types.ObjectId.isValid(cardId)) {
      res.status(400).json({ error: "Invalid card ID" });
      return;
    }

    const flashcard = await Flashcard.findById(cardId as string);
    if (!flashcard) {
      res.status(404).json({ error: "FLASHCARD_NOT_FOUND" });
      return;
    }

    if (flashcard.userId.toString() !== userId) {
      res.status(403).json({ error: "UNAUTHORIZED" });
      return;
    }

    res.json(flashcard);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message || "Failed to fetch flashcard" });
  }
}

async function store(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId;
    const { question, answer, difficulty } = req.body;

    const validation = validateFlashcard(question, answer);
    if (!validation.isValid) {
      res.status(400).json({ errors: validation.errors });
      return;
    }

    if (!userId || !Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "USER_NOT_FOUND" });
      return;
    }

    const flashcard = new Flashcard({
      userId,
      question,
      answer,
      difficulty: difficulty || "medium",
    });

    await flashcard.save();

    res
      .status(201)
      .json({ message: "Flashcard created successfully", flashcard });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message || "Failed to create flashcard" });
  }
}

async function update(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId;
    const { cardId } = req.params;
    const { question, answer, difficulty, isReviewed } = req.body;

    if (!cardId || !Types.ObjectId.isValid(cardId)) {
      res.status(400).json({ error: "Invalid card ID" });
      return;
    }

    const flashcard = await Flashcard.findById(cardId as string);
    if (!flashcard) {
      res.status(404).json({ error: "FLASHCARD_NOT_FOUND" });
      return;
    }

    if (flashcard.userId.toString() !== userId) {
      res.status(403).json({ error: "UNAUTHORIZED" });
      return;
    }

    const updateData: any = {};
    if (question !== undefined) updateData.question = question;
    if (answer !== undefined) updateData.answer = answer;
    if (difficulty !== undefined) updateData.difficulty = difficulty;
    if (isReviewed !== undefined) updateData.isReviewed = isReviewed;

    if (Object.keys(updateData).length === 0) {
      res.status(400).json({ error: "No fields to update" });
      return;
    }

    const updatedFlashcard = await Flashcard.findByIdAndUpdate(
      cardId as string,
      updateData,
      {
        new: true,
      },
    );

    res.json({
      message: "Flashcard updated successfully",
      flashcard: updatedFlashcard,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message || "Failed to update flashcard" });
  }
}

async function destroy(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId;
    const { cardId } = req.params;

    if (!cardId || !Types.ObjectId.isValid(cardId)) {
      res.status(400).json({ error: "Invalid card ID" });
      return;
    }

    const flashcard = await Flashcard.findById(cardId as string);
    if (!flashcard) {
      res.status(404).json({ error: "FLASHCARD_NOT_FOUND" });
      return;
    }

    if (flashcard.userId.toString() !== userId) {
      res.status(403).json({ error: "UNAUTHORIZED" });
      return;
    }

    await Flashcard.findByIdAndDelete(cardId as string);

    res.json({ message: "Flashcard deleted successfully" });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message || "Failed to delete flashcard" });
  }
}

export { index, show, store, update, destroy };
