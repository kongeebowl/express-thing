const mongoose = require("mongoose");
const { Schema } = mongoose;

const flashcardSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
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
