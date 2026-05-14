const express = require("express");
const router = express.Router();
const streamifier = require("streamifier");
import { cloudinary } from "../config/cloudinary";
import { upload } from "../middleware/multer";
const Flashcard = require("../models/flashcard");
import type { Request, Response } from "express";
import { currentUser } from "../middleware/currentUser";
import { validateFileUpload } from "../middleware/validation";

interface MulterRequest extends Request {
  file?: any; // we dont talk about this
}

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload an image to a flashcard
 *     description: Uploads an image file to Cloudinary and associates it with a flashcard. Supports JPEG, PNG, GIF, WebP up to 5MB.
 *     tags:
 *       - Upload
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Image file (JPEG, PNG, GIF, WebP, max 5MB)
 *               flashcardId:
 *                 type: string
 *                 description: The ID of the flashcard to associate with the image
 *             required:
 *               - file
 *               - flashcardId
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 flashcard:
 *                   $ref: '#/components/schemas/Flashcard'
 *       400:
 *         description: Validation error - invalid file type, size too large, or missing flashcardId
 *       401:
 *         description: Unauthorized - user not authenticated
 *       403:
 *         description: Forbidden - user does not own the flashcard
 *       404:
 *         description: Flashcard not found
 *       500:
 *         description: Server error during upload
 */
router.post(
  "/",
  currentUser,
  upload.single("file"),
  validateFileUpload,
  async (req: MulterRequest, res: Response) => {
    try {
      const { flashcardId } = req.body;
      const userId = (req as any).userId;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const flashcard = await Flashcard.findById(flashcardId);
      if (!flashcard) {
        return res.status(404).json({ message: "Flashcard not found" });
      }

      if (flashcard.userId !== userId) {
        return res
          .status(403)
          .json({ message: "Unauthorized to update this flashcard" });
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        async (error: any, result: any) => {
          if (error) {
            return res.status(400).json({ message: "Failed to upload image" });
          }

          flashcard.imageUrl = result.secure_url;
          await flashcard.save();

          res.status(200).json({
            message: "Image uploaded successfully",
            flashcard,
          });
        },
      );

      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  },
);

module.exports = router;
