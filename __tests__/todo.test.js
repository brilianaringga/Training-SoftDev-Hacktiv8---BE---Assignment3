const request = require("supertest");
const app = require("../src/app");
const { sequelize, Users, Todo } = require("../src/models");
const { generateToken } = require("../src/helpers/jwt");
const { hashPassword } = require("../src/helpers/bcrypt");

let token;
let todos;

beforeAll(async () => {
  try {
    // create user & get token
    const user = await Users.create({
      username: "testusername",
      email: "test@mail.com",
      password: hashPassword("rahasia"),
    });

    let payload = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    token = generateToken(payload);

    todos = await Todo.bulkCreate([
      { task: "Belajar nodejs", UserId: user.id },
      { task: "Belajar react", UserId: user.id },
    ]);
  } catch (error) {
    console.log(error);
  }
});

afterAll(async () => {
  await Todo.destroy({ truncate: true });
  await Users.destroy({ truncate: true, cascade: true });
  await sequelize.close();
});

describe("To Do TEST [SUCCESS CASE]", () => {
  test("should be able to add task", async () => {
    const response = await request(app)
      .post("/addtask")
      .set("Content-Type", "application/json")
      .auth(token, { type: "bearer" })
      .send({
        task: "testname",
        userId: 1,
      });

    expect(response.statusCode).toBe(200);
  });

  test("should be able to show task", async () => {
    const response = await request(app)
      .get("/showtask")
      .set("Content-Type", "application/json")
      .auth(token, { type: "bearer" });

    expect(response.statusCode).toBe(200);
  });

  test("should not be able to add task", async () => {
    const response = await request(app)
      .post("/addtask")
      .set("Content-Type", "application/json")
      .send({
        name: "testname",
        username: "testusername",
        email: "test-email@mail.com",
        password: "testpassword",
      });

    expect(response.statusCode).toBe(401);
  });

  test("should not be able to show task", async () => {
    const response = await request(app)
      .get("/showtask")
      .set("Content-Type", "application/json");

    expect(response.statusCode).toBe(401);
  });
});
