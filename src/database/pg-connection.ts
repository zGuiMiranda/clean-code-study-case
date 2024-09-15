import { Account } from "../signup/domain/account.entity";
import { IConnection } from "./interface-connection";
import pgp, { IDatabase } from "pg-promise";

export class PGConnection implements IConnection {
  private static instance: PGConnection;
  private static db: null | IDatabase<Account> = null;

  private constructor() {
    if (!PGConnection.db) {
      PGConnection.db = pgp()("postgres://postgres:123456@localhost:8080/app");
    }
    this.connection = PGConnection.db;
  }

  static getInstance(): PGConnection {
    if (!PGConnection.instance) {
      PGConnection.instance = new PGConnection();
    }
    return PGConnection.instance;
  }

  private connection: IDatabase<Account>;

  async query(query: string, values: any) {
    return this.connection.query(query, values);
  }

  async end(): Promise<void> {
    await this.connection.$pool.end();
  }

  async deleteAll(queryString: string): Promise<void> {
    await this.connection.none(queryString);
  }
}
