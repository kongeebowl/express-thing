import { Router } from "express";
const flashcardController = require("../controllers/flashcardController");

const router = Router();

router.get("/:userId/flashcards", flashcardController.index);

router.post("/:userId/flashcards", flashcardController.store);

router.get("/:userId/flashcards/:cardId", flashcardController.show);

router.put("/:userId/flashcards/:cardId", flashcardController.update);

router.delete("/:userId/flashcards/:cardId", flashcardController.destroy);

export default router;
