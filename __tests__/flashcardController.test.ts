import { Request, Response } from "express";
const flashcardController = require("../controllers/flashcardController");
import { Flashcard } from "../models/flashcard";

jest.mock("../models/flashcard");

interface TestRequest extends Partial<Request> {
  currentUser?: any;
}

describe("Flashcard Controller", () => {
  let req: TestRequest;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      params: {},
      currentUser: { id: "user1", email: "test@example.com", role: "user" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe("index", () => {
    it("should return flashcards for the current user", async () => {
      const mockFlashcards = [
        {
          id: "1",
          userId: "user1",
          question: "What is 2+2?",
          answer: "4",
        },
      ];
      (Flashcard.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockFlashcards),
      });

      await flashcardController.index(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(mockFlashcards);
    });

    it("should return error on database failure", async () => {
      (Flashcard.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error("DB Error")),
      });

      await flashcardController.index(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("create", () => {
    it("should create a new flashcard", async () => {
      const mockFlashcard = {
        id: "1",
        userId: "user1",
        question: "What is 2+2?",
        answer: "4",
        save: jest.fn().mockResolvedValue({}),
      };
      (Flashcard.create as jest.Mock).mockResolvedValue(mockFlashcard);

      await flashcardController.create(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(mockFlashcard);
    });

    it("should return error on creation failure", async () => {
      (Flashcard.create as jest.Mock).mockRejectedValue(
        new Error("Creation Error"),
      );

      await flashcardController.create(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("destroy", () => {
    it("should delete a flashcard owned by user", async () => {
      const mockFlashcard = {
        id: "1",
        userId: "user1",
        deleteOne: jest.fn().mockResolvedValue({}),
      };
      req.params = { id: "1" };
      (Flashcard.findById as jest.Mock).mockResolvedValue(mockFlashcard);

      await flashcardController.destroy(req as Request, res as Response);

      expect(mockFlashcard.deleteOne).toHaveBeenCalled();
    });

    it("should return 404 if flashcard not found", async () => {
      req.params = { id: "999" };
      (Flashcard.findById as jest.Mock).mockResolvedValue(null);

      await flashcardController.destroy(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 403 if user does not own flashcard", async () => {
      const mockFlashcard = {
        id: "1",
        userId: "different_user",
      };
      req.params = { id: "1" };
      (Flashcard.findById as jest.Mock).mockResolvedValue(mockFlashcard);

      await flashcardController.destroy(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe("find", () => {
    it("should return a flashcard owned by user", async () => {
      const mockFlashcard = {
        id: "1",
        userId: "user1",
        question: "What is 2+2?",
        answer: "4",
      };
      req.params = { id: "1" };
      (Flashcard.findById as jest.Mock).mockResolvedValue(mockFlashcard);

      await flashcardController.find(req as Request, res as Response);

      expect(Flashcard.findById).toHaveBeenCalledWith({ id: "1" });
    });

    it("should return 404 if flashcard not found", async () => {
      req.params = { id: "999" };
      (Flashcard.findById as jest.Mock).mockResolvedValue(null);

      await flashcardController.find(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("update", () => {
    it("should update a flashcard", async () => {
      const updatedFlashcard = {
        id: "1",
        userId: "user1",
        question: "Updated question",
        answer: "Updated answer",
      };
      req.params = { id: "1" };
      req.body = { question: "Updated question", answer: "Updated answer" };
      (Flashcard.findByIdAndUpdate as jest.Mock).mockResolvedValue(
        updatedFlashcard,
      );

      await flashcardController.update(req as Request, res as Response);

      expect(res.send).toHaveBeenCalledWith(updatedFlashcard);
    });

    it("should return error on update failure", async () => {
      req.params = { id: "1" };
      req.body = { question: "Updated" };
      (Flashcard.findByIdAndUpdate as jest.Mock).mockRejectedValue(
        new Error("Update Error"),
      );

      await flashcardController.update(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
