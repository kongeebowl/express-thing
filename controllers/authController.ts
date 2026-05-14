import type { Request, Response } from "express";
import { User } from "../models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

/**
 * Registers a new user account
 * @param {Request} req - Express request object with name, email, password in body
 * @param {Response} res - Express response object
 * @returns {Promise<void>} 200 on success or error status
 */
async function signUp(req: Request, res: Response) {
  const { name, email, password } = req.body;

  if (await User.findOne({ email }))
    return res.status(409).json({ error: "dawg u already in here" });

  try {
    const newUser = await User.create({
      name,
      email,
      password,
    });
    await newUser.save();

    return res.sendStatus(200);
  } catch {
    return res.status(500).json({ error: "uh oh spaghettio" });
  }
}

/**
 * Authenticates a user and returns a JWT token
 * @param {Request} req - Express request object with email and password in body
 * @param {Response} res - Express response object
 * @returns {Promise<void>} User data with JWT token or 401 error
 */
async function signIn(req: Request, res: Response) {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (!existingUser)
    return res.status(401).json({ error: "wrong credentials" });

  if (!(await bcrypt.compare(password, existingUser.password)))
    return res.status(401).json({ error: "wrong credentials" });

  const payload = {
    name: existingUser.name,
    email: existingUser.email,
  };

  const userJWT = jwt.sign(payload, process.env.JWT_KEY!, { expiresIn: "6h" });

  res.status(200).send({
    ...existingUser.toJSON(),
    token: userJWT,
  });
}

/**
 * Logs out the current user (clears session)
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>} 204 No Content
 */
async function logout(req: Request, res: Response) {
  res.sendStatus(204);
}

module.exports = { signUp, signIn, logout };
