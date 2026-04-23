const mongoose = require("mongoose");
const { Schema } = mongoose;

const schemaDefinition = {
  question: { type: String, required: true },
  answer: { type: String, required: true },
  image: { type: String, required: true },
  group: { type: String, required: true },
  owner: { type: User, required: true },
  // status: { type: String, required: true, enum: ["new", "learning", "good"] },
};

const flashcardSchema = new Schema(schemaDefinition, {
  timestamps: true,
  toJSON: {
    transform(ret: any) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  },
});

const Flashcard = mongoose.model("Flashcard", flashcardSchema);

export { Flashcard };
