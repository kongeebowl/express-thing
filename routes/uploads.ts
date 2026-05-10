import { Router } from "express";
import {
  uploadFile,
  downloadFile,
  deleteFile,
} from "../controllers/uploadController.js";
import { uploadMiddleware } from "../middleware/uploadMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

// Upload file (protected)
router.post("/", authMiddleware, uploadMiddleware.single("file"), uploadFile);

// Download file
router.get("/:filename", downloadFile);

// Delete file (protected)
router.delete("/:filename", authMiddleware, deleteFile);

export default router;
