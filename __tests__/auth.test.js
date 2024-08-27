const request = require("supertest");
const app = require("../src/app");
const { sequelize, Users } = require("../src/models");
const { hashPassword } = require("../src/helpers/bcrypt");

beforeAll(async () => {
  try {
    const user = await Users.create({
      name: "test",
      username: "testname",
      email: "test@mail.com",
      password: hashPassword("rahasia"),
    });
  } catch (error) {
    console.log(error);
  }
});

afterAll(async () => {
  await Users.destroy({ truncate: true, cascade: true })
    .then(() => {
      sequelize.close();
    })
    .catch((err) => {
      console.log(err);
    });
});

describe("Authentication TEST [SUCCESS CASE]", () => {
  it("Should be able to register", async () => {
    const response = await request(app)
      .post("/register")
      .set("Content-Type", "application/json")
      .send({
        name: "testname",
        username: "testusername",
        email: "test-email@mail.com",
        password: "testpassword",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.email).toBe("test-email@mail.com");
  });

  it("Should be able to login", async () => {
    const response = await request(app)
      .post("/login")
      .set("Content-Type", "application/json")
      .send({
        email: "test@mail.com",
        password: "rahasia",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  it("Should not be able to register", async () => {
    const response = await request(app)
      .post("/register")
      .set("Content-Type", "application/json")
      .send({
        name: "testname",
        username: "testusername",
        email: "test-email@mail.com",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Parameter Error");
    expect(response.body.message).toBe("Password must be provided");
  });

  it("Should not be able to login", async () => {
    const response = await request(app)
      .post("/login")
      .set("Content-Type", "application/json")
      .send({
        name: "testname",
        username: "testusername",
        email: "test-email@mail.com",
        password: "testpassword1",
      });

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("Unauthenticated");
    expect(response.body.message).toBe("Invalid email or password");
  });
});
