import express from "express";
const router = express.Router();
const flashcardController = require("../controllers/flashcardController");
import { verifyToken } from "../middleware/auth";

router.get("/", verifyToken, flashcardController.index);
router.get("/:id", verifyToken, flashcardController.find);
router.put("/:id", verifyToken, flashcardController.update);
router.post("/", verifyToken, flashcardController.create);
router.delete("/:id", verifyToken, flashcardController.destroy);

module.exports = router;
