import type { Request, Response } from "express";
import { Flashcard } from "../models/flashcard";

async function index(req: Request, res: Response) {
  try {
    const flashcards = await Flashcard.find({
      userId: req.currentUser!.id,
    }).populate("userId");
    res.status(200).send(flashcards);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch flashcards" });
  }
}

async function create(req: Request, res: Response) {
  try {
    const flashcard = await Flashcard.create({
      question: "question",
      answer: "answer",
      userId: req.currentUser!.id,
    });
    flashcard.save();
    res.status(201).send(flashcard);
  } catch (err) {
    res.status(400).send({ error: "Failed to create flashcard" });
  }
}

async function destroy(req: Request, res: Response) {
  try {
    const flashcard = await Flashcard.findById(req.params.id);
    if (!flashcard) {
      return res.status(404).send({ error: "Flashcard not found" });
    }

    if (flashcard.userId !== req.currentUser!.id)
      res.status(403).send({ error: "you are wrong sir man" });

    await flashcard.deleteOne();
    res.status(201);
  } catch (err) {
    res.status(400).send({ error: "Failed to delete flashcard" });
  }
}

async function find(req: Request, res: Response) {
  try {
    const id = req.params;
    const flashcard = await Flashcard.findById(id);

    if (!flashcard)
      return res.status(404).json({ error: "flashcard not found" });
    if (flashcard.userId !== req.currentUser!.id)
      return res.status(403).json({ error: "you are wrong person man sir" });
  } catch (error) {
    return res.status(400).json({ error: "something very very bad happened" });
  }
}

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
