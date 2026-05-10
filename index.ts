import express from "express";
import cors from "cors";
import "dotenv/config";
import "./mongoose.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import flashcardRoutes from "./routes/flashcards.js";
import uploadRoutes from "./routes/uploads.js";

const port = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files as static
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/flashcards", flashcardRoutes);
app.use("/upload", uploadRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
