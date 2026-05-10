import type { Request, Response } from "express";
import User from "../models/user.js";

async function index(req: Request, res: Response) {
  const users = await User.find();
  res.send(users);
}

async function show(req: Request, res: Response) {
  const id = req.params;
  const user = await User.findById(id);
  res.status(201).send(user);
}

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
