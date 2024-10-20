const request = require("supertest");
const app = require("../../app");
const Book = require("../../models/Book");

// Mock the Book model
jest.mock("../../models/Book");

// Mock the authenticate and restrictTo middleware
jest.mock("../../controllers/userController", () => ({
  authenticate: jest.fn((req, res, next) => next()),
  restrictTo: jest.fn(() => (req, res, next) => next()),
  register: jest.fn(() => (req, res, next) => next()),
  login: jest.fn(() => (req, res, next) => next()),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe("Book Controller", () => {
  describe("GET /api/books", () => {
    it("should return available books", async () => {
      const mockBooks = [
        { title: "Book 1", author: "Author 1", copiesAvailable: 5 },
        { title: "Book 2", author: "Author 2", copiesAvailable: 3 },
      ];
      // Mock Book.find to return available books
      Book.find.mockResolvedValue(mockBooks);
      const response = await request(app).get("/api/books");
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0].title).toBe("Book 1");
      expect(Book.find).toHaveBeenCalledWith({ copiesAvailable: { $gt: 0 } });
    });
  });
  describe("POST /api/books", () => {
    it("should create a new book (admin only)", async () => {
      const mockBook = {
        title: "New Book",
        author: "New Author",
        totalCopies: 10,
        copiesAvailable: 10,
      };
      // Mock Book.create to return a created book
      Book.create.mockResolvedValue(mockBook);
      const response = await request(app).post("/api/books").send({
        title: "New Book",
        author: "New Author",
        totalCopies: 10,
      });
      expect(response.status).toBe(201);
      expect(response.body.title).toBe("New Book");
      expect(Book.create).toHaveBeenCalledWith({
        title: "New Book",
        author: "New Author",
        totalCopies: 10,
        copiesAvailable: 10,
      });
    });
  });

  describe("PUT /api/books/:id", () => {
    it("should update a book details (admin only)", async () => {
      const mockUpdatedBook = {
        title: "Updated Book Title",
        author: "Updated Author",
        copiesAvailable: 8,
        totalCopies: 10,
      };
      // Mock Book.findByIdAndUpdate to return an updated book
      Book.findByIdAndUpdate.mockResolvedValue(mockUpdatedBook);
      const response = await request(app).put("/api/books/1").send({
        title: "Updated Book Title",
        author: "Updated Author",
        copiesAvailable: 8,
      });
      expect(response.status).toBe(200);
      expect(response.body.title).toBe("Updated Book Title");
      expect(Book.findByIdAndUpdate).toHaveBeenCalledWith(
        "1",
        {
          title: "Updated Book Title",
          author: "Updated Author",
          copiesAvailable: 8,
        },
        { new: true, runValidators: true }
      );
    });
    it("should return 404 if the book is not found", async () => {
      // Mock Book.findByIdAndUpdate to return null if the book doesn't exist
      Book.findByIdAndUpdate.mockResolvedValue(null);
      const response = await request(app).put("/api/books/15").send({
        title: "Non-existent Book",
      });
      console.log(response.body);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("No Book found with this id");
    });
  });
  describe("DELETE /api/books/:id", () => {
    it("should delete a book by id (admin only)", async () => {
      // Mock Book.findByIdAndDelete to return a book
      Book.findByIdAndDelete.mockResolvedValue({
        title: "Book to be deleted",
      });
      const response = await request(app).delete("/api/books/1");
      expect(response.status).toBe(204);
      expect(Book.findByIdAndDelete).toHaveBeenCalledWith("1");
    });
    it("should return 404 if the book is not found", async () => {
      // Mock Book.findByIdAndDelete to return null if the book doesn't exist
      Book.findByIdAndDelete.mockResolvedValue(null);
      const response = await request(app).delete("/api/books/invalid-id");
      expect(response.status).toBe(404);
      // expect(response.body.message).toBe("No Book found with this id");
    });
  });
});
