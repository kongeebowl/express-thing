import express from "express";
const router = express.Router();
import { verifyToken } from "../middleware/auth";
const User = require("../models/user");
const Flashcard = require("../models/flashcard");

const adminAuth = (req: any, res: any, next: any) => {
  if (!req.user) {
    return res.status(401).redirect("/auth/signin");
  }
  next();
};

/**
 * @swagger
 * /admin:
 *   get:
 *     summary: Admin dashboard
 *     description: View system statistics and admin controls
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard rendered successfully
 *       401:
 *         description: Unauthorized - authentication required
 *       500:
 *         description: Server error
 */
router.get("/", verifyToken, adminAuth, async (req: any, res: any) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFlashcards = await Flashcard.countDocuments();

    res.render("admin/dashboard", {
      totalUsers,
      totalFlashcards,
      currentUser: req.user,
    });
  } catch (error: any) {
    res.status(500).render("error", { message: error.message });
  }
});

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: List all users
 *     description: Retrieve a list of all users in the system
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User list rendered successfully
 *       401:
 *         description: Unauthorized - authentication required
 *       500:
 *         description: Server error
 */
router.get("/users", verifyToken, adminAuth, async (req: any, res: any) => {
  try {
    const users = await User.find().select("-password");
    res.render("admin/users", { users, currentUser: req.user });
  } catch (error: any) {
    res.status(500).render("error", { message: error.message });
  }
});

/**
 * @swagger
 * /admin/users/{id}/delete:
 *   post:
 *     summary: Delete a user
 *     description: Delete a user account from the system
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to delete
 *     responses:
 *       302:
 *         description: Redirect to users list
 *       401:
 *         description: Unauthorized - authentication required
 *       500:
 *         description: Server error
 */
router.post(
  "/users/:id/delete",
  verifyToken,
  adminAuth,
  async (req: any, res: any) => {
    try {
      const { id } = req.params;
      await User.findByIdAndDelete(id);
      res.redirect("/admin/users");
    } catch (error: any) {
      res.status(500).render("error", { message: error.message });
    }
  },
);

/**
 * @swagger
 * /admin/flashcards:
 *   get:
 *     summary: List all flashcards
 *     description: Retrieve a list of all flashcards in the system with owner information
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Flashcard list rendered successfully
 *       401:
 *         description: Unauthorized - authentication required
 *       500:
 *         description: Server error
 */
router.get(
  "/flashcards",
  verifyToken,
  adminAuth,
  async (req: any, res: any) => {
    try {
      const flashcards = await Flashcard.find().populate(
        "userId",
        "name email",
      );
      res.render("admin/flashcards", { flashcards, currentUser: req.user });
    } catch (error: any) {
      res.status(500).render("error", { message: error.message });
    }
  },
);

/**
 * @swagger
 * /admin/flashcards/{id}/delete:
 *   post:
 *     summary: Delete a flashcard
 *     description: Delete a flashcard from the system
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Flashcard ID to delete
 *     responses:
 *       302:
 *         description: Redirect to flashcards list
 *       401:
 *         description: Unauthorized - authentication required
 *       500:
 *         description: Server error
 */
router.post(
  "/flashcards/:id/delete",
  verifyToken,
  adminAuth,
  async (req: any, res: any) => {
    try {
      const { id } = req.params;
      await Flashcard.findByIdAndDelete(id);
      res.redirect("/admin/flashcards");
    } catch (error: any) {
      res.status(500).render("error", { message: error.message });
    }
  },
);

module.exports = router;
