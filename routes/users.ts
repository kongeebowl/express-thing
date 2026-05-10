import { Router } from "express";
import { index, show, update, destroy } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", index);
router.get("/:id", show);
router.put("/:id", authMiddleware, update);
router.delete("/:id", authMiddleware, destroy);

export default router;
