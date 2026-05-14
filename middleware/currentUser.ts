import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

/**
 * Middleware to extract and attach current user from JWT token
 * Attempts to verify JWT from Authorization header
 * Sets currentUser on request if token is valid
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 * @returns {void}
 */
export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.headers.authorization) return next();

  try {
    const payload = jwt.verify(
      req.headers.authorization,
      process.env.JWT_KEY!,
    ) as UserPayload;
    req.currentUser = payload;
  } catch (err) {
    (req as any).session = null;
    res.status(401).json({ message: "you are invalid" });
    return;
  }

  next();
};
