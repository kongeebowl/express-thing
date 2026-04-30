import type { Request, Response } from "express";
import { Flashcard } from "../models/flashcardModel.js";
import type { SortOrder } from "mongoose";
import User from "../models/userModel.js";

export type Flashcard = {
  question: string;
  answer: string;
  group: string;
};

async function index(req: Request, res: Response) {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "USER_NOT_FOUND" });
      return;
    }

    const flashcards = await Flashcard.find({ userId });
    res.json(flashcards);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message || "Failed to fetch flashcards" });
  }
}

async function show(req: Request, res: Response) {
  try {
    const { userId, cardId } = req.params;

    const flashcard = await Flashcard.findById(cardId);
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

async function store(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const { question, answer, difficulty } = req.body;

    if (!question || !answer) {
      res.status(400).json({ error: "Question and answer are required" });
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

async function update(req: Request, res: Response) {
  try {
    const { userId, cardId } = req.params;
    const { question, answer, difficulty, isReviewed } = req.body;

    const flashcard = await Flashcard.findById(cardId);
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
      cardId,
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

async function destroy(req: Request, res: Response) {
  try {
    const { userId, cardId } = req.params;

    const flashcard = await Flashcard.findById(cardId);
    if (!flashcard) {
      res.status(404).json({ error: "FLASHCARD_NOT_FOUND" });
      return;
    }

    if (flashcard.userId.toString() !== userId) {
      res.status(403).json({ error: "UNAUTHORIZED" });
      return;
    }

    await Flashcard.findByIdAndDelete(cardId);

    res.json({ message: "Flashcard deleted successfully" });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message || "Failed to delete flashcard" });
  }
}

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
};
