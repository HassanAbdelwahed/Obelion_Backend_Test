const request = require("supertest");
const app = require("../../app");
const mongoose = require("mongoose");
const Book = require("../../models/Book");
const User = require("../../models/User");
const BorrowingHistory = require("../../models/BorrowingHistory");
const { connect, disconnect } = require("./setup");
const jwt = require("jsonwebtoken");

// Helper function to generate token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createAdminAndGetToken = async () => {
  const admin = new User({
    username: "adminUser",
    email: "admin@example.com",
    password: "password123",
    passwordConfirm: "password123",
    role: "ADMIN",
  });
  await admin.save();
  return generateToken(admin._id, admin.role);
};

const createBook = async (bookData = {}) => {
  const book = new Book({
    title: bookData.title || "Default Book Title",
    author: bookData.author || "Default Author",
    totalCopies: bookData.totalCopies || 10,
    copiesAvailable: bookData.copiesAvailable || 10,
  });
  return await book.save();
};

const createBorrowingHistory = async (userId, bookId) => {
  const borrowingHistory = new BorrowingHistory({
    userId: userId,
    bookId: bookId,
    borrowDate: new Date(),
    returnDate: null, // Book still borrowed
  });
  return await borrowingHistory.save();
};

beforeAll(async () => {
  await connect();
});

afterEach(async () => {
  await Book.deleteMany({});
  await User.deleteMany({});
  await BorrowingHistory.deleteMany({});
});

afterAll(async () => {
  await disconnect();
});

describe("Reports Routes", () => {
  it("GET /api/reports/borrowed - should return a report of currently borrowed books (admin only)", async () => {
    const token = await createAdminAndGetToken();
    let user = new User({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      passwordConfirm: "password123",
      role: "USER",
    });
    user = await user.save();

    const book = await createBook({ title: "Borrowed Book" });
    await createBorrowingHistory(user._id, book._id);

    const response = await request(app)
      .get("/api/reports/borrowed")
      .set("Authorization", `Bearer ${token}`);
    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].bookId.title).toBe("Borrowed Book");
  });

  it("GET /api/reports/popular - should return a report of the most popular books (admin only)", async () => {
    const token = await createAdminAndGetToken();

    const book1 = await createBook({ title: "Popular Book 1" });
    const book2 = await createBook({ title: "Popular Book 2" });

    const user = new User({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      passwordConfirm: "password123",
      role: "USER",
    });
    await user.save();

    // Simulate multiple borrowings for book1 to make it "popular"
    await createBorrowingHistory(user._id, book1._id);
    await createBorrowingHistory(user._id, book1._id);
    await createBorrowingHistory(user._id, book2._id);

    const response = await request(app)
      .get("/api/reports/popular")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0].title).toBe("Popular Book 1"); // Most borrowed
    expect(response.body[1].title).toBe("Popular Book 2"); // Less borrowed
  });
});
