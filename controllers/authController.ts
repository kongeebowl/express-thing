import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const User = require("../models/user");

async function signUp(req: Request, res: Response) {
  const { name, email, password } = req.body;

  if (await User.findOne({ email }))
    return res.status(409).json({ error: "USER_ALREADY_EXISTS" });

  try {
    const newUser = await User.create({
      name,
      email,
      password,
    });
    await newUser.save();

    return res.sendStatus(200);
  } catch {
    return res.status(500).json({ error: "SIGN_UP_FAILED" });
  }
}

async function signIn(req: Request, res: Response) {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (!existingUser)
    return res.status(401).json({ error: "INVALID_CREDENTIALS" });

  if (!(await bcrypt.compare(password, existingUser.password)))
    return res.status(401).json({ error: "INVALID_CREDENTIALS" });

  const payload = {
    id: existingUser.id,
    email: existingUser.email,
    role: existingUser.role,
  };

  const userJWT = jwt.sign(payload, process.env.JWT_KEY!, { expiresIn: "6h" });

  res.status(200).send({
    ...existingUser.toJSON(),
    token: userJWT,
  });
}

async function logout(req: Request, res: Response) {
  res.sendStatus(204);
}

module.exports = {
  signUp,
  signIn,
  logout,
};
