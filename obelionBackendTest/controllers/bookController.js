const Book = require("../models/Book");
const tryCatch = require("../helpers/tryCatch.js");

exports.getAvailableBooks = tryCatch(async (req, res, next) => {
  // search and filters
  let query = Book.find();
  let queryObj = { ...req.query, copiesAvailable: { gt: 0 } };
  delete queryObj["fields"];

  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  queryObj = JSON.parse(queryStr);

  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    query = query.select(fields);
  }

  const books = await query.find(queryObj);
  res.json(books);
});

exports.createBook = tryCatch(async (req, res, next) => {
  const createdBook = await Book.create({
    title: req.body.title,
    author: req.body.author,
    totalCopies: req.body.totalCopies,
    copiesAvailable: req.body.totalCopies,
  });
  res.status(201).json(createdBook);
});

exports.updateBook = tryCatch(async (req, res, next) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!book) {
    return res.status(404).json({ message: "No Book found with this id" });
  }
  res.status(200).json(book);
});

exports.deleteBook = tryCatch(async (req, res, next) => {
  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) {
    return res.status(404).json({ message: "No Book found with this id" });
  }
  res.status(204).json("Book has been deleted.");
});
