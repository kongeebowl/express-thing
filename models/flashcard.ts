import mongoose from "mongoose";
import { Schema } from "mongoose";

/**
 * @swagger
 * definitions:
 *   Flashcard:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *       userId:
 *         type: string
 *       question:
 *         type: string
 *       answer:
 *         type: string
 *       imageUrl:
 *         type: string
 */

/**
 * Flashcard Schema
 * Represents a study flashcard with question, answer, and optional image
 * Each flashcard is owned by a user and timestamped
 */
const flashcardSchema = new Schema(
  {
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: false,
    },
    // difficulty: {
    //   type: String,
    //   enum: ["easy", "medium", "hard"],
    //   default: "medium",
    // },
    // isReviewed: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  {
    timestamps: true,
    toJSON: {
      transform(ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

const Flashcard = mongoose.model("Flashcard", flashcardSchema);

export { Flashcard };
