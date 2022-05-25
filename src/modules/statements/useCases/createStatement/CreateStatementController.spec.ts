import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database/index";

let connection: Connection;

describe("Create statement controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a deposit statement", async () => {
    const newUser = await request(app).post("/api/v1/users").send({
      name: "User teste",
      email: "teste@teste.com",
      password: "123456",
    });
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "teste@teste.com",
      password: "123456",
    });
    const { token } = responseToken.body;

    const deposit = await request(app)
      .post("/api/v1/deposit")
      .send({
        amount: 150,
        description: "deposit 150",
      })
      .set({
        Authorization: "Bearer " + token,
      });

    //expect(deposit.status).toBe(201);
  });
});
