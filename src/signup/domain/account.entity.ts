import crypto from "crypto";

export class Account {
  readonly id;
  readonly name;
  readonly email: string;
  readonly password: string;
  readonly cpf: string;
  readonly isDriver: boolean;
  readonly isPassenger: boolean;
  readonly carPlate: string;
  constructor({
    id,
    name,
    email,
    password,
    carPlate,
    cpf,
    isDriver,
    isPassenger,
  }: {
    id?: string;
    name: string;
    email: string;
    password: string;
    cpf: string;
    isDriver: boolean;
    isPassenger: boolean;
    carPlate: string;
  }) {
    this.id = id || crypto.randomUUID();
    this.name = name;
    this.email = email;
    this.password = password;
    this.cpf = cpf;
    this.isDriver = isDriver;
    this.isPassenger = isPassenger;
    this.carPlate = carPlate;
  }

  validateName(): boolean {
    if (!this.name) return false;
    return /[a-zA-Z] [a-zA-Z]+/.test?.(this.name);
  }
  validateEmail(): boolean {
    if (!this.email) return false;

    return /^(.+)@(.+)$/.test(this.email);
  }
  validateCarPlate() {
    if (!this.carPlate) return false;

    return /[A-Z]{3}[0-9]{4}/.test(this.carPlate);
  }
  validatePassword() {
    return !!this.password;
  }
  static validateEmail(email: string): boolean {
    return /^(.+)@(.+)$/.test(email);
  }
}
