import type { Request, Response } from "express";
import { Flashcard } from "../models/flashcardModel.js";
import type { SortOrder } from "mongoose";

export type Flashcard = {
  question: string;
  answer: string;
  group: string;
};

async function index(req: Request, res: Response) {
  let query: any = {};
  let limit = 20;
  let sortBy = { updatedAt: 1 as SortOrder };

  if (req.query.category) query.category = req.query.category.toString();

  if (req.query.q) limit = Number(req.query.q);

  if (req.query.sort === "dateDes") sortBy = { updatedAt: -1 as SortOrder };

  const flashcards = await Flashcard.find(query)
    .sort(sortBy)
    .skip(Number(req.query.skip) ?? 0)
    .limit(limit + 1);
  const isMore = flashcards.length > limit;
  if (isMore) flashcards.pop();

  const response = {
    flashcards: flashcards,
    isMore: isMore,
  };

  res.status(200).send(response);
}
