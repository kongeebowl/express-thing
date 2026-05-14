import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcrypt from "bcrypt";

/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *       name:
 *         type: string
 *       email:
 *         type: string
 *         format: email
 *       createdAt:
 *         type: string
 *         format: date-time
 *       updatedAt:
 *         type: string
 *         format: date-time
 */

/**
 * User Schema
 * Represents a user account with email, name, and hashed password
 * Passwords are automatically hashed on save
 */
const schemaDefinition = {
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true },
  password: { type: String, required: true, trim: true },
} as const;

const userSchema = new Schema(schemaDefinition, {
  timestamps: true,
  toJSON: {
    transform(ret: any) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.password;
    },
  },
});

/**
 * Pre-save hook to hash password before storing
 * Only hashes if password has been modified
 */
userSchema.pre("save", async function (this: any) {
  if (!this.isModified("password")) return;

  const hashed = await bcrypt.hash(this.password, 10);
  this.password = hashed;
});

/**
 * Compare provided password with stored hashed password
 * @param {string} candidatePassword - The password to verify
 * @returns {Promise<boolean>} True if passwords match, false otherwise
 */
userSchema.methods.comparePassword = async function (
  candidatePassword: string,
) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export { User };
