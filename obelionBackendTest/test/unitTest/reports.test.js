const request = require("supertest");
const app = require("../../app"); // Replace with the path to your app
const BorrowingHistory = require("../../models/BorrowingHistory");
const Book = require("../../models/Book");

// Mock the models
jest.mock("../../models/BorrowingHistory");
jest.mock("../../models/Book");

jest.mock("../../controllers/userController", () => ({
  authenticate: jest.fn((req, res, next) => {
    req.user = { role: "ADMIN" }; // Mock user role as ADMIN
    next();
  }),
  restrictTo: jest.fn(() => (req, res, next) => next()),
  register: jest.fn(() => (req, res, next) => next()),
  login: jest.fn(() => (req, res, next) => next()),
}));

describe("Report Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/reports/borrowed", () => {
    it("should return a report of currently borrowed books", async () => {
      const mockBorrowedBooks = [
        {
          _id: "borrowing1",
          bookId: { title: "Book 1", author: "Author 1" },
          userId: { name: "User 1" },
          status: "BORROWED",
        },
        {
          _id: "borrowing2",
          bookId: { title: "Book 2", author: "Author 2" },
          userId: { name: "User 2" },
          status: "BORROWED",
        },
      ];

      BorrowingHistory.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockBorrowedBooks),
      });

      const response = await request(app).get("/api/reports/borrowed");

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0].bookId.title).toBe("Book 1");
      expect(BorrowingHistory.find).toHaveBeenCalledWith({
        status: "BORROWED",
      });
    });

    it("should return an empty array if no borrowed books are found", async () => {
      BorrowingHistory.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue([]),
      });

      const response = await request(app).get("/api/reports/borrowed");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });
});
