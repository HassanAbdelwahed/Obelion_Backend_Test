const Book = require("../models/Book");
const tryCatch = require("../helpers/tryCatch.js");
const BorrowingHistory = require("../models/BorrowingHistory.js");

// Get a report of currently borrowed books
exports.getBorrowedBooksReport = tryCatch(async (req, res, next) => {
  const borrowedBooks = await BorrowingHistory.find({
    status: "BORROWED",
  }).populate("bookId userId");

  res.json(borrowedBooks);
});

// Get a report of the most popular books
exports.getPopularBooksReport = tryCatch(async (req, res, next) => {
  const popularBooks = await Book.find().sort({ borrowedCount: -1 }).limit(10);
  console.log(popularBooks);
  res.json(popularBooks);
});
