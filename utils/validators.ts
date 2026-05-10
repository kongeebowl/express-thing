interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateName = (name: string): boolean => {
  return name.length >= 2 && name.length <= 100;
};

export const validateFlashcard = (
  question: string,
  answer: string,
): ValidationResult => {
  const errors: string[] = [];

  if (!question || question.trim().length === 0) {
    errors.push("Question is required");
  } else if (question.length < 5) {
    errors.push("Question must be at least 5 characters");
  } else if (question.length > 1000) {
    errors.push("Question must not exceed 1000 characters");
  }

  if (!answer || answer.trim().length === 0) {
    errors.push("Answer is required");
  } else if (answer.length < 5) {
    errors.push("Answer must be at least 5 characters");
  } else if (answer.length > 5000) {
    errors.push("Answer must not exceed 5000 characters");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateRegister = (
  name: string,
  email: string,
  password: string,
): ValidationResult => {
  const errors: string[] = [];

  if (!name || !validateName(name)) {
    errors.push("Name must be between 2-100 characters");
  }

  if (!email || !validateEmail(email)) {
    errors.push("Invalid email format");
  }

  if (!password || !validatePassword(password)) {
    errors.push("Password must be at least 6 characters");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateUpdateUser = (data: any): ValidationResult => {
  const errors: string[] = [];

  if (data.name !== undefined && !validateName(data.name)) {
    errors.push("Name must be between 2-100 characters");
  }

  if (data.email !== undefined && !validateEmail(data.email)) {
    errors.push("Invalid email format");
  }

  if (data.password !== undefined && !validatePassword(data.password)) {
    errors.push("Password must be at least 6 characters");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
