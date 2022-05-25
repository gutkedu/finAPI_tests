import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database/index";

let connection: Connection;

describe("Show user profile controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to show a user profile", async () => {
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

    const getUserProfile = await request(app)
      .get("/api/v1/profile")
      .set("Authorization", `Bearer ${token}`);

    //expect(getUserProfile.status).toBe(200);
  });
});
