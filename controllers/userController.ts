import type { Request, Response } from "express";
const User = require("../models/userModel");

export type User = {
  name: string;
  email: string;
  password: string;
};

async function index(req: Request, res: Response) {
  const users = await User.find();
  res.send(users);
}

async function show(req: Request, res: Response) {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: "USER_NOT_FOUND" });
  res.send(user);
}

module.exports = {
  index,
  show,
};
