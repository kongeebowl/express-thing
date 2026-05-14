import type { Request, Response } from "express";
import { User } from "../models/user";

/**
 * Retrieves all users from the database
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>} JSON array of all users
 */
async function index(req: Request, res: Response) {
  const users = await User.find();
  res.send(users);
}

/**
 * Retrieves a single user by ID
 * @param {Request} req - Express request object with user ID
 * @param {Response} res - Express response object
 * @returns {Promise<void>} User data or 404 error
 */
async function show(req: Request, res: Response) {
  const id = req.params;
  const user = await User.findById(id);
  res.status(201).send(user);
}

/**
 * Deletes a user account by ID
 * @param {Request} req - Express request object with user ID
 * @param {Response} res - Express response object
 * @returns {Promise<void>} 204 No Content on success or error message
 */
async function destroy(req: Request, res: Response) {
  const id = req.params;
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).send({ error: "how is this possible bro" });
  }

  await user.deleteOne();
  res.sendStatus(204);
}

module.exports = { index, show, destroy };
