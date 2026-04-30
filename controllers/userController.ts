import type { Request, Response } from "express";
const User = require("../models/userModel");

export type User = {
  name: string;
  email: string;
  password: string;
};

// Get all users
async function index(req: Request, res: Response) {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch users" });
  }
}

// Get user by ID
async function show(req: Request, res: Response) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "USER_NOT_FOUND" });
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch user" });
  }
}

// Create user
async function store(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: "Name, email, and password are required" });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ error: "Email already in use" });
      return;
    }

    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({ message: "User created successfully", user });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to create user" });
  }
}

// Update user
async function update(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;
    const updateData: any = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = password;

    if (Object.keys(updateData).length === 0) {
      res.status(400).json({ error: "No fields to update" });
      return;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!user) {
      res.status(404).json({ error: "USER_NOT_FOUND" });
      return;
    }

    res.json({ message: "User updated successfully", user });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update user" });
  }
}

// Delete user
async function destroy(req: Request, res: Response) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ error: "USER_NOT_FOUND" });
      return;
    }
    res.json({ message: "User deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to delete user" });
  }
}

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
};
