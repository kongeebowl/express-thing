import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcrypt from "bcrypt";

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

userSchema.pre("save", async function (next: any) {
  if (!this.isModified("password")) return next();

  const hashed = await bcrypt.hash(this.password, 10);
  this.password = hashed;

  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
