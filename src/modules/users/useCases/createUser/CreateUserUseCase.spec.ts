import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let userRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create user test", () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepository);
  });

  it("should be able to create a user", async () => {
    let newUser = {
      name: "test sample user",
      email: "test@example.com",
      password: "test password",
    };
    await createUserUseCase.execute(newUser);
    const findUser = await userRepository.findByEmail(newUser.email);
    expect(findUser).toHaveProperty("id");
  });

  it("should not be able to create a user with an existing email", async () => {
    expect(async () => {
      let newUser = {
        name: "test sample user",
        email: "test@example.com",
        password: "test password",
      };
      await createUserUseCase.execute({
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
      });
      await createUserUseCase.execute({
        name: "test 2",
        email: newUser.email,
        password: "test",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
