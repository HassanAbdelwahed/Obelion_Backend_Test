const request = require("supertest");
const app = require("../../app");
const mongoose = require("mongoose");
const Book = require("../../models/Book");
const User = require("../../models/User");
const { connect, disconnect } = require("./setup");
const jwt = require("jsonwebtoken");

// Helper function to generate token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createAdminAndGetToken = async () => {
  let admin = new User({
    username: "adminUser",
    email: "admin@example.com",
    password: "password123",
    passwordConfirm: "password123",
    role: "ADMIN",
  });
  admin = await admin.save();
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

// Set up and tear down the database before and after tests
beforeAll(async () => {
  await connect();
});

afterEach(async () => {
  await Book.deleteMany({});
  await User.deleteMany({});
});

afterAll(async () => {
  await disconnect();
});

describe("Books Routes", () => {
  it("GET /api/books - should retrieve a list of available books", async () => {
    await createBook({ title: "Test Book" });

    const response = await request(app).get("/api/books");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].title).toBe("Test Book");
  });

  it("POST /api/books - should add a new book (admin only)", async () => {
    const token = await createAdminAndGetToken();

    const response = await request(app)
      .post("/api/books")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "New Book",
        author: "Author",
        totalCopies: 5,
        copiesAvailable: 5,
      });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe("New Book");
  });

  it("PUT /api/books/:id - should update book details (admin only)", async () => {
    const token = await createAdminAndGetToken();
    const book = await createBook({ title: "Old Title" });

    const response = await request(app)
      .put(`/api/books/${book._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Title",
        author: "New Author",
      });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe("Updated Title");
  });

  it("DELETE /api/books/:id - should delete a book by ID (admin only)", async () => {
    const token = await createAdminAndGetToken();
    const book = await createBook({ title: "Book to Delete" });

    const response = await request(app)
      .delete(`/api/books/${book._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);
  });
});
