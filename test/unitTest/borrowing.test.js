const request = require("supertest");
const app = require("../../app");
const Book = require("../../models/Book");
const BorrowingHistory = require("../../models/BorrowingHistory");
const userController = require("../../controllers/userController");

// Mock the Book and BorrowingHistory models
jest.mock("../../models/Book");
jest.mock("../../models/borrowingHistory");

// Mock the authenticate middleware
jest.mock("../../controllers/userController", () => ({
  authenticate: jest.fn((req, res, next) => {
    req.user = { _id: "user123" };
    next();
  }),
  restrictTo: jest.fn(() => (req, res, next) => next()),
  register: jest.fn(() => (req, res, next) => next()),
  login: jest.fn(() => (req, res, next) => next()),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe("Borrowing Controller", () => {
  describe("POST /api/borrow", () => {
    it("should borrow a book successfully", async () => {
      const mockBook = {
        _id: "book123",
        copiesAvailable: 5,
        borrowedCount: 0,
        save: jest.fn(),
      };
      Book.findById.mockResolvedValue(mockBook);

      BorrowingHistory.create.mockResolvedValue({
        _id: "borrowing123",
        userId: "user123",
        bookId: "book123",
        status: "BORROWED",
      });

      const response = await request(app)
        .post("/api/borrow")
        .send({ bookId: "book123" });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Book borrowed successfully");
      expect(Book.findById).toHaveBeenCalledWith("book123");
      expect(mockBook.save).toHaveBeenCalled();
      expect(BorrowingHistory.create).toHaveBeenCalledWith({
        userId: "user123",
        bookId: "book123",
        status: "BORROWED",
      });
    });

    it("should return 404 if book not found", async () => {
      Book.findById.mockResolvedValue(null);
      const response = await request(app)
        .post("/api/borrow")
        .send({ bookId: "14" });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("No Book found with this id");
    });

    it("should return 400 if book is not available", async () => {
      const mockBook = {
        _id: "book123",
        copiesAvailable: 0,
      };
      Book.findById.mockResolvedValue(mockBook);
      const response = await request(app)
        .post("/api/borrow")
        .send({ bookId: "book123" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Book not available");
    });
  });

  describe("POST /api/return", () => {
    it("should return a borrowed book successfully", async () => {
      const mockBorrowing = {
        _id: "borrowing123",
        userId: "user123",
        bookId: "book123",
        status: "BORROWED",
        save: jest.fn(),
      };
      BorrowingHistory.findOneAndUpdate.mockResolvedValue(mockBorrowing);

      const mockBook = {
        _id: "book123",
        copiesAvailable: 0,
        save: jest.fn(),
      };
      Book.findById.mockResolvedValue(mockBook);

      const response = await request(app)
        .post("/api/return")
        .send({ bookId: "book123" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Book returned successfully");
      expect(BorrowingHistory.findOneAndUpdate).toHaveBeenCalledWith(
        { userId: "user123", bookId: "book123", status: "BORROWED" },
        { status: "RETURNED", returnDate: expect.any(Date) },
        { new: true }
      );
      expect(mockBook.save).toHaveBeenCalled();
    });

    it("should return 404 if no active borrowing is found", async () => {
      BorrowingHistory.findOneAndUpdate.mockResolvedValue(null);
      const response = await request(app)
        .post("/api/return")
        .send({ bookId: "book123" });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe(
        "No active borrowing found for this book"
      );
    });
  });
});
