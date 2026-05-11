import express from "express";
const router = new express.Router();
const flashcardController =
  await import("../controllers/flashcardController.js");
const auth = await import("../middleware/auth.js");

router.get("/", auth, flashcardController.index);
router.get("/:id", auth, flashcardController.find);
router.put("/:id", auth, flashcardController.update);
router.post("/", auth, flashcardController.create);
router.delete("/:id", auth, flashcardController.destroy);
