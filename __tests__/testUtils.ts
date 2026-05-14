/**
 * Integration test setup and utilities
 */

import mongoose from "mongoose";
import { User } from "../models/user";
import { Flashcard } from "../models/flashcard";

/**
 * Connect to test database
 */
export const connectDB = async () => {
  const testDbUri =
    process.env.TEST_MONGO_URI || "mongodb://localhost:27017/flashcard-test";
  try {
    await mongoose.connect(testDbUri);
  } catch (error) {
    throw error;
  }
};

/**
 * Disconnect from test database
 */
export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
  } catch (error) {
    throw error;
  }
};

/**
 * Clear all collections
 */
export const clearDB = async () => {
  try {
    await User.deleteMany({});
    await Flashcard.deleteMany({});
  } catch (error) {
    throw error;
  }
};

/**
 * Create a test user
 */
export const createTestUser = async (userData?: Partial<any>) => {
  const defaultUser = {
    name: "Test User",
    email: "test@example.com",
    password: "password123",
    ...userData,
  };
  return await User.create(defaultUser);
};

/**
 * Create a test flashcard
 */
export const createTestFlashcard = async (flashcardData?: Partial<any>) => {
  const defaultFlashcard = {
    userId: "test-user-id",
    question: "What is 2+2?",
    answer: "4",
    ...flashcardData,
  };
  return await Flashcard.create(defaultFlashcard);
};
