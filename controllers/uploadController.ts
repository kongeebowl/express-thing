import type { Request, Response } from "express";
import path from "path";
import fs from "fs";

interface UploadRequest extends Request {
  file?: Express.Multer.File;
}

async function uploadFile(req: UploadRequest, res: Response) {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file provided" });
      return;
    }

    const fileInfo = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: `uploads/${req.file.filename}`,
      uploadedAt: new Date(),
    };

    res.status(201).json({
      message: "File uploaded successfully",
      file: fileInfo,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "File upload failed" });
  }
}

async function downloadFile(req: Request, res: Response) {
  try {
    const { filename } = req.params;

    // Prevent directory traversal attacks
    if (filename.includes("..") || filename.includes("/")) {
      res.status(400).json({ error: "Invalid filename" });
      return;
    }

    const filepath = path.join("uploads", filename);

    if (!fs.existsSync(filepath)) {
      res.status(404).json({ error: "File not found" });
      return;
    }

    res.download(filepath);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "File download failed" });
  }
}

async function deleteFile(req: Request, res: Response) {
  try {
    const { filename } = req.params;

    // Prevent directory traversal attacks
    if (filename.includes("..") || filename.includes("/")) {
      res.status(400).json({ error: "Invalid filename" });
      return;
    }

    const filepath = path.join("uploads", filename);

    if (!fs.existsSync(filepath)) {
      res.status(404).json({ error: "File not found" });
      return;
    }

    fs.unlinkSync(filepath);
    res.json({ message: "File deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "File deletion failed" });
  }
}

export { uploadFile, downloadFile, deleteFile };
