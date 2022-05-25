import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AppError } from "../../../../shared/errors/AppError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to authenticate an user", async () => {
    const user: ICreateUserDTO = {
      name: "Usuario teste",
      email: "teste@example.com",
      password: "password",
    };
    await createUserUseCase.execute(user);
    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });
    expect(result).toHaveProperty("token");
  });

  it("should not be able to login with an incorrect email", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "Usuario teste",
        email: "teste@example.com",
        password: "password",
      };
      await createUserUseCase.execute(user);
      await authenticateUserUseCase.execute({
        email: "incorrect@email.com",
        password: user.password,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to login with an incorrect password", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "Usuario teste",
        email: "teste@example.com",
        password: "password",
      };
      await createUserUseCase.execute(user);
      await authenticateUserUseCase.execute({
        email: user.email,
        password: "incorrect password",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
