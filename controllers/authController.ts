import type { Request, Response } from "express";
import { User } from "../models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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

async function logout(req: Request, res: Response) {
  res.sendStatus(204);
}

module.exports = { signUp, signIn, logout };
