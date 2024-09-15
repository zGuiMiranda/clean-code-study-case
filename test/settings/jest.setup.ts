import { IConnection } from "../../src/database/interface-connection";
import { PGConnection } from "../../src/database/pg-connection";

let pgConnection: IConnection;

beforeAll(async () => {
  pgConnection = PGConnection.getInstance();
});

afterAll(async () => {
  if (pgConnection) {
    await pgConnection.deleteAll("DELETE FROM ccca.account");
    await pgConnection.end();
  }
});
