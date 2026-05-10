const express = require("express");
const router = new express.Router();
const flashcardController = require("../controllers/flashcardController");
const auth = require("../middleware/auth");

router.get("/", auth, flashcardController.index);
router.get("/:id", auth, flashcardController.find);
router.put("/:id", auth, flashcardController.update);
router.post("/", auth, flashcardController.create);
router.delete("/:id", auth, flashcardController.destroy);
