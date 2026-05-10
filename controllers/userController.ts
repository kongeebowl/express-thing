import type { Request, Response } from "express";
import { Types } from "mongoose";
import User from "../models/userModel.js";
import {
  getPaginationOptions,
  createPaginatedResponse,
} from "../utils/pagination.js";
import { validateUpdateUser, validateEmail } from "../utils/validators.js";

async function index(req: Request, res: Response) {
  try {
    const { page, limit } = getPaginationOptions(req.query);
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().skip(skip).limit(limit),
      User.countDocuments(),
    ]);

    const paginatedResponse = createPaginatedResponse(
      users,
      total,
      page,
      limit,
    );
    res.json(paginatedResponse);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch users" });
  }
}

async function show(req: Request, res: Response) {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    const user = await User.findById(req.params.id as string);
    if (!user) {
      res.status(404).json({ error: "USER_NOT_FOUND" });
      return;
    }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch user" });
  }
}

async function update(req: Request, res: Response) {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    const { name, email, password } = req.body;
    const validation = validateUpdateUser({ name, email, password });

    if (!validation.isValid) {
      res.status(400).json({ errors: validation.errors });
      return;
    }

    // Check if email is already in use (if updating email)
    if (email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: req.params.id },
      });
      if (existingUser) {
        res.status(409).json({ error: "Email already in use" });
        return;
      }
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = password;

    if (Object.keys(updateData).length === 0) {
      res.status(400).json({ error: "No fields to update" });
      return;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id as string,
      updateData,
      {
        new: true,
      },
    );

    if (!user) {
      res.status(404).json({ error: "USER_NOT_FOUND" });
      return;
    }

    res.json({ message: "User updated successfully", user });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update user" });
  }
}

async function destroy(req: Request, res: Response) {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    const user = await User.findByIdAndDelete(req.params.id as string);
    if (!user) {
      res.status(404).json({ error: "USER_NOT_FOUND" });
      return;
    }
    res.json({ message: "User deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to delete user" });
  }
}

export { index, show, update, destroy };
