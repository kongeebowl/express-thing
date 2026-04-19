const mongoose = require("mongoose");
const { Schema } = mongoose;

const schemaDefinition = {
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },
} as const;

const userSchema = new Schema(schemaDefinition, {
  toJSON: {
    transform(ret: any) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.password;
    },
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
