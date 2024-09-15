import { IConnection } from "../../database/interface-connection";
import { Account } from "../domain/account.entity";
import { SignupRepositoryInterface } from "./signup-repository-interface";

type Model = {
  account_id: string;
  name: string;
  car_plate: string;
  cpf: string;
  email: string;
  is_driver: boolean;
  is_passenger: boolean;
  password: string;
};

export class SignupRepository
  implements SignupRepositoryInterface<Account | undefined, Model>
{
  constructor(private connection: IConnection) {
    this.connection = connection;
  }

  getByEmail = async (email: string) => {
    const [response]: Model[] = await this.connection.query(
      "select * from ccca.account where email = $1",
      [email]
    );
    return this.transformToDomain(response);
  };
  signup = async ({
    id,
    name,
    email,
    cpf,
    carPlate,
    isPassenger,
    isDriver,
    password,
  }: Account) => {
    await this.connection.query(
      "insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)",
      [id, name, email, cpf, carPlate, !!isPassenger, !!isDriver, password]
    );
  };

  transformToDomain = (value: Model) => {
    if (!value) return;
    return new Account({
      id: value.account_id,
      name: value.name,
      carPlate: value.car_plate,
      cpf: value.cpf,
      isDriver: value.is_driver,
      isPassenger: value.is_passenger,
      password: value.password,
      email: value.email,
    });
  };
}
