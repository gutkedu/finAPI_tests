import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show user profile use case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  });

  it("should be able to show the user profile", async () => {
    const user = await usersRepository.create({
      name: "test user",
      email: "test@example.com",
      password: "test password",
    });

    if (user.id != undefined) {
      const userProfile = await showUserProfileUseCase.execute(user.id);
      expect(userProfile).toBeInstanceOf(User);
    }
  });

  it("should not be able to show user profile of a nonexistent user", async () => {
    await expect(
      showUserProfileUseCase.execute("non-existing-user")
    ).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
