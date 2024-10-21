const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide the title of the book"],
      unique: true,
    },
    author: {
      type: String,
      required: [true, "Please provide the author of the book"],
    },
    copiesAvailable: {
      type: Number,
      required: [true, "Please specify how many copies are available"],
      min: [0, "Available copies cannot be less than 0"],
    },
    totalCopies: {
      type: Number,
      required: [true, "Please specify the total number of copies"],
    },
    borrowedCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
