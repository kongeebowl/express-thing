import type { Request, Response, NextFunction } from "express";

/**
 * Validation error response
 */
interface ValidationError {
  field: string;
  message: string;
}

/**
 * Multer Request with file property
 */
interface MulterRequest extends Request {
  file?: any;
}

/**
 * Email validation regex
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email) && email.length <= 255;
};

/**
 * Validate password strength
 * Minimum 6 characters
 */
export const validatePassword = (password: string): boolean => {
  return !!(password && password.length >= 6);
};

/**
 * Validate name field
 */
export const validateName = (name: string): boolean => {
  return !!(name && name.trim().length >= 2 && name.length <= 100);
};

/**
 * Validate flashcard question/answer
 */
export const validateFlashcardText = (text: string): boolean => {
  return !!(text && text.trim().length >= 1 && text.length <= 1000);
};

/**
 * Signup validation middleware
 */
export const validateSignup = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors: ValidationError[] = [];
  const { name, email, password } = req.body;

  if (!name) {
    errors.push({ field: "name", message: "Name is required" });
  } else if (!validateName(name)) {
    errors.push({ field: "name", message: "Name must be 2-100 characters" });
  }

  if (!email) {
    errors.push({ field: "email", message: "Email is required" });
  } else if (!validateEmail(email)) {
    errors.push({ field: "email", message: "Invalid email format" });
  }

  if (!password) {
    errors.push({ field: "password", message: "Password is required" });
  } else if (!validatePassword(password)) {
    errors.push({
      field: "password",
      message: "Password must be at least 6 characters",
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors, message: "Validation failed" });
  }

  next();
};

/**
 * Signin validation middleware
 */
export const validateSignin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors: ValidationError[] = [];
  const { email, password } = req.body;

  if (!email) {
    errors.push({ field: "email", message: "Email is required" });
  } else if (!validateEmail(email)) {
    errors.push({ field: "email", message: "Invalid email format" });
  }

  if (!password) {
    errors.push({ field: "password", message: "Password is required" });
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors, message: "Validation failed" });
  }

  next();
};

/**
 * Create flashcard validation middleware
 */
export const validateCreateFlashcard = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors: ValidationError[] = [];
  const { question, answer } = req.body;

  if (!question) {
    errors.push({ field: "question", message: "Question is required" });
  } else if (!validateFlashcardText(question)) {
    errors.push({
      field: "question",
      message: "Question must be 1-1000 characters",
    });
  }

  if (!answer) {
    errors.push({ field: "answer", message: "Answer is required" });
  } else if (!validateFlashcardText(answer)) {
    errors.push({
      field: "answer",
      message: "Answer must be 1-1000 characters",
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors, message: "Validation failed" });
  }

  next();
};

/**
 * Update flashcard validation middleware
 */
export const validateUpdateFlashcard = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors: ValidationError[] = [];
  const { question, answer } = req.body;

  // At least one field must be provided for update
  if (!question && !answer) {
    errors.push({
      field: "body",
      message: "At least question or answer must be provided",
    });
  }

  if (question && !validateFlashcardText(question)) {
    errors.push({
      field: "question",
      message: "Question must be 1-1000 characters",
    });
  }

  if (answer && !validateFlashcardText(answer)) {
    errors.push({
      field: "answer",
      message: "Answer must be 1-1000 characters",
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors, message: "Validation failed" });
  }

  next();
};

/**
 * File upload validation middleware
 */
export const validateFileUpload = (
  req: MulterRequest,
  res: Response,
  next: NextFunction,
) => {
  const errors: ValidationError[] = [];

  if (!req.file) {
    errors.push({ field: "file", message: "File is required" });
  } else {
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (req.file.size > maxSize) {
      errors.push({
        field: "file",
        message: "File size must be less than 5MB",
      });
    }

    // Check file type (images only)
    const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedMimes.includes(req.file.mimetype)) {
      errors.push({
        field: "file",
        message: "Only image files are allowed (JPEG, PNG, GIF, WebP)",
      });
    }
  }

  if (!req.body.flashcardId) {
    errors.push({ field: "flashcardId", message: "Flashcard ID is required" });
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors, message: "Validation failed" });
  }

  next();
};
