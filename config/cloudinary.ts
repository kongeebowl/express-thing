import { v2 as cloudinary } from "cloudinary";

/**
 * Configure Cloudinary with environment variables
 * Used for image storage and manipulation
 * Requires CLOUD_NAME, CLOUD_API_KEY, and CLOUD_API_SECRET env vars
 */
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export { cloudinary };
