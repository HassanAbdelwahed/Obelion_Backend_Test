const request = require("supertest");
const app = require("../../app");
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

const createUserAndGetToken = async () => {
  let user = new User({
    username: "testdUser",
    email: "test@example.com",
    password: "password123",
    passwordConfirm: "password123",
    role: "USER",
  });
  user = await user.save();
  return generateToken(user._id, user.role);
};

// Before each test, set up the database
beforeAll(async () => {
  await connect();
});

afterEach(async () => {
  await Book.deleteMany({});
  await BorrowingHistory.deleteMany({});
});

afterAll(async () => {
  await disconnect();
});

describe("Borrowing Routes", () => {
  it("POST /api/borrow - should borrow a book", async () => {
    let book = new Book({
      title: "Book to Borrow",
      author: "Author",
      totalCopies: 5,
      copiesAvailable: 5,
    });
    book = await book.save();
    const token = await createUserAndGetToken();

    const response = await request(app)
      .post("/api/borrow")
      .set("Authorization", `Bearer ${token}`)
      .send({ bookId: book._id });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Book borrowed successfully");
  });

  it("POST /api/return - should return a borrowed book", async () => {
    let book = new Book({
      title: "Book to Return",
      author: "Author",
      totalCopies: 5,
      copiesAvailable: 4,
    });
    book = await book.save();

    let user = new User({
      username: "testdUser",
      email: "test2@example.com",
      password: "password123",
      passwordConfirm: "password123",
      role: "USER",
    });
    user = await user.save();
    const token = generateToken(user._id, "USER");

    const borrowing = new BorrowingHistory({
      userId: user._id,
      bookId: book._id,
      status: "BORROWED",
    });
    await borrowing.save();

    const response = await request(app)
      .post("/api/return")
      .set("Authorization", `Bearer ${token}`)
      .send({ bookId: book._id });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Book returned successfully");
  });
});
