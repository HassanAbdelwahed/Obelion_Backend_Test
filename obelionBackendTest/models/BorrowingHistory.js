const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const borrowingHistorySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide the user ID who is borrowing the book"],
    },
    bookId: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: [true, "Please provide the book ID that is being borrowed"],
    },
    borrowDate: {
      type: Date,
      default: Date.now,
      required: [true, "Please provide the borrow date"],
    },
    returnDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["BORROWED", "RETURNED"],
      default: "BORROWED",
      required: [
        true,
        "Please provide the status of the book (BORROWED or RETURNED)",
      ],
    },
  },
  { timestamps: true }
);

const BorrowingHistory = mongoose.model(
  "BorrowingHistory",
  borrowingHistorySchema
);
module.exports = BorrowingHistory;
