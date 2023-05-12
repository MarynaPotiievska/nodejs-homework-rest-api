require("dotenv").config();

const supertest = require("supertest");
const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");

const app = require("../app");
// const User = require("../models/user");

const { DB_TEST_URI } = process.env;

describe("test login controller", () => {
  beforeAll(async () => {
    await mongoose.connect(DB_TEST_URI);

    // const hashedPassword = await bcrypt.hash("test123456", 10);

    await supertest(app).post("/api/users/register").send({
      password: "test123456",
      email: "test@mail.com",
    });
  });

  afterAll(async () => {
    await mongoose.disconnect(DB_TEST_URI);
  });

  it("should login user", async () => {
    const response = await supertest(app).post("/api/users/login").send({
      password: "test123456",
      email: "test@mail.com",
    });

    // console.log(response);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
        user: expect.objectContaining({
          email: expect.any(String),
          subscription: expect.any(String),
        }),
      })
    );
    expect(response.body).toHaveProperty("token");
    expect(response.body.user).toHaveProperty("email");
    expect(response.body.user).toHaveProperty("subscription");
  });
});
