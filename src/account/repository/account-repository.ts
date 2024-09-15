import { IConnection } from "../../database/interface-connection";
import { Account } from "../../signup/domain/account.entity";
import { AccountRepositoryInterface } from "./account-repository-interface";

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

export class AccountRepository implements AccountRepositoryInterface<Account> {
  constructor(private connection: IConnection) {
    this.connection = connection;
  }
  getById = async (accountId: string) => {
    const [response]: Model[] = await this.connection.query(
      "select * from ccca.account where account_id = $1",
      [accountId]
    );
    return this.transformToDomain(response);
  };

  transformToDomain = (value: Model) => {
    return (
      value &&
      new Account({
        id: value?.account_id,
        name: value?.name,
        carPlate: value?.car_plate,
        cpf: value?.cpf,
        isDriver: value?.is_driver,
        isPassenger: value?.is_passenger,
        password: value?.password,
        email: value?.email,
      })
    );
  };
}
