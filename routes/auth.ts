import express from "express";
const router = express.Router();
const authController = require("../controllers/authController");
import { validateSignup, validateSignin } from "../middleware/validation";

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with email and password
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name (2-100 characters)
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password (minimum 6 characters)
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Validation error - missing or invalid fields
 *       409:
 *         description: Conflict - user with this email already exists
 *       500:
 *         description: Server error during signup
 */
router.post("/signup", validateSignup, authController.signUp);

/**
 * @swagger
 * /auth/signin:
 *   post:
 *     summary: Login with email and password
 *     description: Authenticates a user and returns a JWT token
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       400:
 *         description: Validation error - missing or invalid fields
 *       401:
 *         description: Unauthorized - invalid credentials
 *       500:
 *         description: Server error during signin
 */
router.post("/signin", validateSignin, authController.signIn);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout
 *     description: Logs out the current user (invalidates session)
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Logout successful
 */
router.post("/logout", authController.logout);

module.exports = router;
