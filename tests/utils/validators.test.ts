import {
  validateEmail,
  validatePassword,
  validateName,
  validateFlashcard,
  validateRegister,
} from "../../utils/validators.js";

describe("Validators", () => {
  describe("validateEmail", () => {
    it("should validate correct email", () => {
      expect(validateEmail("test@example.com")).toBe(true);
      expect(validateEmail("user.name@example.co.uk")).toBe(true);
    });

    it("should reject invalid email", () => {
      expect(validateEmail("invalid-email")).toBe(false);
      expect(validateEmail("@example.com")).toBe(false);
      expect(validateEmail("user@")).toBe(false);
    });
  });

  describe("validatePassword", () => {
    it("should validate password with 6+ characters", () => {
      expect(validatePassword("password123")).toBe(true);
      expect(validatePassword("123456")).toBe(true);
    });

    it("should reject password with less than 6 characters", () => {
      expect(validatePassword("pass")).toBe(false);
      expect(validatePassword("12345")).toBe(false);
    });
  });

  describe("validateName", () => {
    it("should validate name with 2-100 characters", () => {
      expect(validateName("John")).toBe(true);
      expect(validateName("Jo")).toBe(true);
      expect(validateName("A".repeat(100))).toBe(true);
    });

    it("should reject name with invalid length", () => {
      expect(validateName("J")).toBe(false);
      expect(validateName("A".repeat(101))).toBe(false);
    });
  });

  describe("validateFlashcard", () => {
    it("should validate valid flashcard", () => {
      const result = validateFlashcard(
        "What is the capital of France?",
        "Paris is the capital of France",
      );
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    it("should reject flashcard with short question", () => {
      const result = validateFlashcard("What?", "Answer");
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should reject flashcard with empty answer", () => {
      const result = validateFlashcard("Valid question here", "");
      expect(result.isValid).toBe(false);
    });
  });

  describe("validateRegister", () => {
    it("should validate correct registration data", () => {
      const result = validateRegister(
        "John Doe",
        "john@example.com",
        "password123",
      );
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    it("should reject invalid email in registration", () => {
      const result = validateRegister(
        "John Doe",
        "invalid-email",
        "password123",
      );
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes("email"))).toBe(true);
    });

    it("should reject short password in registration", () => {
      const result = validateRegister("John Doe", "john@example.com", "pass");
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes("Password"))).toBe(true);
    });
  });
});
