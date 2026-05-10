import { Router } from "express";
import {
  index,
  show,
  store,
  update,
  destroy,
} from "../controllers/flashcardController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", authMiddleware, index);
router.post("/", authMiddleware, store);
router.get("/:cardId", authMiddleware, show);
router.put("/:cardId", authMiddleware, update);
router.delete("/:cardId", authMiddleware, destroy);

export default router;
