import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database/index";

let connection: Connection;

describe("Create user controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a user", async () => {
    const responseUser = await request(app).post("/api/v1/users").send({
      name: "User teste",
      email: "teste@teste.com",
      password: "123456",
    });
    expect(responseUser.status).toBe(201);
    expect(responseUser.body).toStrictEqual({});
  });

  it("should not be able to create a user with the same email", async () => {
    const newUser = await request(app).post("/api/v1/users").send({
      name: "User teste 2 ",
      email: "teste@teste.com",
      password: "123456",
    });
    expect(newUser.status).toBe(400);
  });
});
