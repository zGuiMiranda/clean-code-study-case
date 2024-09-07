import { Account } from "../domain/account.entity";
import crypto from "crypto";
import { validateCpf } from "../../validateCpf";
import { SignupRepository } from "../repository/signup-repository";
import { PGConnection } from "../../database/pg-connection";

export class SignupService {
  private repository;
  constructor() {
    this.repository = new SignupRepository(PGConnection.getInstance());
  }

  signup = async (account: Account) => {
    const { email, cpf, isDriver } = account;

    const acc = await this.repository.getByEmail(email);

    if (acc) throw new Error("Conta existente");
    if (!account.validateName()) throw new Error("Nome inválido");
    if (!account.validateEmail()) throw new Error("Email inválido");
    if (!validateCpf(cpf)) throw new Error("CPF inválido");
    if (!account.validatePassword()) throw new Error("Senha inválida");
    if (isDriver && !account.validateCarPlate())
      throw new Error("Placa do carro inválida");

    const id = crypto.randomUUID();

    await this.repository.signup(account);

    return { id };
  };

  getByEmail = async (email: string) => {
    if (!Account.validateEmail(email)) throw new Error("Email inválido");
    const acc = await this.repository.getByEmail(email);
    return acc;
  };
}
