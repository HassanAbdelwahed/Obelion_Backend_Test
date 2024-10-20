const request = require("supertest");
const app = require("../../app");
const User = require("../../models/User");
const { connect, disconnect } = require("./setup");

// Before each test, set up the database
beforeAll(async () => {
  await connect();
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await disconnect();
});

describe("User Routes", () => {
  it("POST /api/register - should register a new user", async () => {
    const response = await request(app).post("/api/register").send({
      username: "testuser",
      email: "hassan_al@yahoo.com",
      password: "password123",
      passwordConfirm: "password123",
      role: "USER",
    });
    expect(response.status).toBe(201);
    expect(response.body.status).toBe("success");
  });

  it("POST /api/login - should login a user", async () => {
    // First, create a user
    const user = new User({
      username: "testuser",
      email: "hassan_al@yahoo.com",
      password: "password123",
      passwordConfirm: "password123",
      role: "USER",
    });
    await user.save();

    const response = await request(app).post("/api/login").send({
      email: "hassan_al@yahoo.com",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });
});
