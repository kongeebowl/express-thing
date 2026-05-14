const multer = require("multer");

/**
 * Configure multer for in-memory file storage
 * Stores uploaded files in memory as buffer instead of disk
 * Useful for processing files before uploading to cloud storage
 */
const storage = multer.memoryStorage();

/**
 * Multer middleware instance configured with memory storage
 * Use with upload.single(fieldname) or upload.array(fieldname) on routes
 */
export const upload = multer({
  storage,
});
