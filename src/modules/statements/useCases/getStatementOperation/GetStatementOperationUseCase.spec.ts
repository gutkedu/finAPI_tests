import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType, Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let usersRepository: IUsersRepository;
let statementRepository: IStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get statement operation test", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepository,
      statementRepository
    );
  });

  it("should be able to get a statement operation", async () => {
    const user: User = await usersRepository.create({
      name: "User teste",
      email: " teste@teste.com",
      password: "test",
    });

    if (user.id !== undefined) {
      const statement: Statement = await statementRepository.create({
        user_id: user.id,
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "test deposit",
      });
      if (statement.id !== undefined) {
        const operationStatement = await getStatementOperationUseCase.execute({
          user_id: user.id,
          statement_id: statement.id,
        });
        expect(operationStatement).toBe(statement);
      }
    }
  });

  it("should not be able to get a statement with a non existent statement", async () => {
    const statement: Statement = await statementRepository.create({
      user_id: "no user",
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "test deposit",
    });
    if (statement.id !== undefined) {
      expect(
        getStatementOperationUseCase.execute({
          user_id: "no user",
          statement_id: statement.id,
        })
      ).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
    }
  });

  it("should not be able to get a statement without a statement id ", async () => {
    const user: User = await usersRepository.create({
      name: "User teste",
      email: " teste@teste.com",
      password: "test",
    });

    if (user.id !== undefined) {
      expect(
        getStatementOperationUseCase.execute({
          user_id: user.id,
          statement_id: "statement id not valid",
        })
      ).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
    }
  });
});
