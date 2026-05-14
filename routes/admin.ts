import express from "express";
const router = express.Router();
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { Flashcard } from "../models/flashcard";

// const adminAuthWithCookie = (req: any, res: any, next: any) => {
//   const token =
//     req.cookies.adminToken || req.headers.authorization?.split(" ")[1] || null;

//   if (!token) {
//     return res.redirect("/admin/login");
//   }

//   try {
//     req.user = jwt.verify(token, process.env.JWT_KEY!);
//     next();
//   } catch {
//     return res.redirect("/admin/login");
//   }
// };

/**
 * @swagger
 * /admin/login:
 *   get:
 *     summary: Admin login page
 *     description: Display the admin login form
 *     tags:
 *       - Admin
 *     responses:
 *       200:
 *         description: Login page rendered successfully
 */
// router.get("/login", (req: any, res: any) => {
//   res.render("admin/login", { errors: [] });
// });

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Admin login
 *     description: Authenticate admin user with email and password
 *     tags:
 *       - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       302:
 *         description: Redirect to admin dashboard on success
 *       400:
 *         description: Invalid credentials or validation error
 */
// router.post("/login", async (req: any, res: any) => {
//   const { email, password } = req.body;
//   const errors: any[] = [];

//   if (!email) {
//     errors.push({ field: "email", message: "Email is required" });
//   }
//   if (!password) {
//     errors.push({ field: "password", message: "Password is required" });
//   }

//   if (errors.length > 0) {
//     return res.render("admin/login", { errors });
//   }

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       errors.push({ message: "Invalid email or password" });
//       return res.render("admin/login", { errors });
//     }

//     const isPasswordValid = await user.comparePassword(password);
//     if (!isPasswordValid) {
//       errors.push({ message: "Invalid email or password" });
//       return res.render("admin/login", { errors });
//     }

//     const token = jwt.sign(
//       { id: user._id, email: user.email, name: user.name },
//       process.env.JWT_KEY!,
//       { expiresIn: "6h" },
//     );

//     // res.cookie("adminToken", token, {
//     //   httpOnly: true,
//     //   secure: process.env.NODE_ENV === "production",
//     //   sameSite: "strict",
//     //   maxAge: 6 * 60 * 60 * 1000,
//     // });

//     res.redirect("/admin");
//   } catch (error: any) {
//     errors.push({ message: "An error occurred during login" });
//     res.render("admin/login", { errors });
//   }
// });

/**
 * @swagger
 * /admin/logout:
 *   post:
 *     summary: Admin logout
 *     description: Clear admin authentication and redirect to login
 *     tags:
 *       - Admin
 *     responses:
 *       302:
 *         description: Redirect to admin login page
 */
// router.post("/logout", (req: any, res: any) => {
//   res.clearCookie("adminToken");
//   res.redirect("/admin/login");
// });

/**
 * @swagger
 * /admin:
 *   get:
 *     summary: Admin dashboard
 *     description: View system statistics and admin controls
 *     tags:
 *       - Admin
 *     responses:
 *       200:
 *         description: Dashboard rendered successfully
 *       302:
 *         description: Redirect to login if not authenticated
 *       500:
 *         description: Server error
 */
router.get("/", async (req: any, res: any) => {
  try {
    const totalUsers = (await User.find()).length;
    const totalFlashcards = (await Flashcard.find()).length;

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
 *     responses:
 *       200:
 *         description: User list rendered successfully
 *       302:
 *         description: Redirect to login if not authenticated
 *       500:
 *         description: Server error
 */
router.get("/users", async (req: any, res: any) => {
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
router.post("/users/:id/delete", async (req: any, res: any) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.redirect("/admin/users");
  } catch (error: any) {
    res.status(500).render("error", { message: error.message });
  }
});

/**
 * @swagger
 * /admin/flashcards:
 *   get:
 *     summary: List all flashcards
 *     description: Retrieve a list of all flashcards in the system with owner information
 *     tags:
 *       - Admin
 *     responses:
 *       200:
 *         description: Flashcard list rendered successfully
 *       302:
 *         description: Redirect to login if not authenticated
 *       500:
 *         description: Server error
 */
router.get("/flashcards", async (req: any, res: any) => {
  try {
    const flashcards = await Flashcard.find().populate("userId", "name email");
    res.render("admin/flashcards", { flashcards, currentUser: req.user });
  } catch (error: any) {
    res.status(500).render("error", { message: error.message });
  }
});

/**
 * @swagger
 * /admin/flashcards/{id}/delete:
 *   post:
 *     summary: Delete a flashcard
 *     description: Delete a flashcard from the system
 *     tags:
 *       - Admin
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
router.post("/flashcards/:id/delete", async (req: any, res: any) => {
  try {
    const { id } = req.params;
    await Flashcard.findByIdAndDelete(id);
    res.redirect("/admin/flashcards");
  } catch (error: any) {
    res.status(500).render("error", { message: error.message });
  }
});

module.exports = router;
