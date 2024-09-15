import { Account } from "../domain/account.entity";
import crypto from "crypto";
import { validateCpf } from "../../validateCpf";
import { SignupRepository } from "../repository/signup-repository";
import { PGConnection } from "../../database/pg-connection";
import { ERROR_MESSAGES } from "../../constants/signup/errors";

export class SignupService {
  private repository;
  constructor() {
    this.repository = new SignupRepository(PGConnection.getInstance());
  }

  signup = async (account: Account) => {
    const { email, cpf, isDriver } = account;

    const acc = await this.repository.getByEmail(email);

    if (acc) throw new Error(ERROR_MESSAGES.ACCOUNT_EXISTS);
    if (!account.validateName()) throw new Error(ERROR_MESSAGES.INVALID_NAME);
    if (!account.validateEmail()) throw new Error(ERROR_MESSAGES.INVALID_EMAIL);
    if (!validateCpf(cpf)) throw new Error(ERROR_MESSAGES.INVALID_CPF);
    if (!account.validatePassword())
      throw new Error(ERROR_MESSAGES.INVALID_PASSWORD);
    if (isDriver && !account.validateCarPlate())
      throw new Error(ERROR_MESSAGES.INVALID_CAR_PLATE);

    await this.repository.signup(account);

    return { id: account.id };
  };

  getByEmail = async (email: string) => {
    if (!Account.validateEmail(email))
      throw new Error(ERROR_MESSAGES.INVALID_EMAIL);
    const acc = await this.repository.getByEmail(email);
    return acc;
  };
}
