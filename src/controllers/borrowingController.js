const Book = require("../models/Book");
const BorrowingHistory = require("../models/BorrowingHistory.js");
const tryCatch = require("../helpers/tryCatch.js");
const Email = require("../helpers/email.js");

exports.borrowBook = tryCatch(async (req, res, next) => {
  const { bookId } = req.body;
  // check if book exist
  const book = await Book.findById(bookId);
  if (!book) {
    return res.status(404).json({ message: "No Book found with this id" });
  }

  if (book.copiesAvailable == 0) {
    return res.status(400).json({ message: "Book not available" });
  }

  // make record BorrowingHistory
  const borrowing = await BorrowingHistory.create({
    userId: req.user._id,
    bookId,
    status: "BORROWED",
  });

  // Decrement book copies
  book.copiesAvailable -= 1;
  book.borrowedCount += 1;
  await book.save();
  const url = `${req.protocol}://${req.get("host")}/me`;
  await new Email(req.user, url).sendBorrowEmail(book.title);
  res.status(201).json({ message: "Book borrowed successfully", borrowing });
});

exports.returnBook = tryCatch(async (req, res, next) => {
  const { bookId } = req.body;
  // check if book exist
  const borrowing = await BorrowingHistory.findOneAndUpdate(
    { userId: req.user._id, bookId, status: "BORROWED" },
    { status: "RETURNED", returnDate: new Date() },
    { new: true }
  );

  if (!borrowing)
    return res
      .status(404)
      .json({ message: "No active borrowing found for this book" });

  // Increment book copies
  const book = await Book.findById(bookId);
  book.copiesAvailable += 1;
  await book.save();
  const url = `${req.protocol}://${req.get("host")}/me`;
  await new Email(req.user, url).sendReturnEmail(book.title);
  res.json({ message: "Book returned successfully", borrowing });
});

exports.getBorrowingHistory = tryCatch(async (req, res, next) => {
  const history = await BorrowingHistory.find({
    userId: req.user._id,
  }).populate("bookId");

  res.json(history);
});
