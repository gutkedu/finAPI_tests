import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database/index";

let connection: Connection;

describe("Authenticate user controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get a jwt token from a logged user", async () => {
    const newUser = await request(app).post("/api/v1/users").send({
      name: "User teste",
      email: "teste@teste.com",
      password: "123456",
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "teste@teste.com",
      password: "123456",
    });

    expect(responseToken.status).toBe(200);
  });

  it("should not be able to get a token from a nonexistent user", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "fail@fail.com",
      password: "123456789",
    });
    expect(responseToken.status).toBe(401);
  });
});
