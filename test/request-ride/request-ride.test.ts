import { faker } from "@faker-js/faker";
import { AccountRepository } from "../../src/account/repository/account-repository";
import { REQUEST_RIDE_ERROR_MESSAGES } from "../../src/constants/signup/errors";
import { IConnection } from "../../src/database/interface-connection";
import { PGConnection } from "../../src/database/pg-connection";
import { RideRepository } from "../../src/ride/repository/ride-repository";
import RequestRide, {
  InputRequestRide,
  OutputRequestRide,
} from "../../src/ride/use-cases/request-ride";
import { UseCaseInterface } from "../../src/shared/use-case-interface";
import { signup } from "../helpers/signup-helper";

let pgConnection: IConnection;
let RequestRideUsecase: UseCaseInterface<InputRequestRide, OutputRequestRide>;

beforeAll(async () => {
  pgConnection = PGConnection.getInstance();

  RequestRideUsecase = new RequestRide(
    new RideRepository(pgConnection),
    new AccountRepository(pgConnection)
  );
});

test("Deve dar erro ao pedir por uma corrida por não encontrar uma conta", async () => {
  const passengerId = faker.string.uuid();

  const data: InputRequestRide = {
    fromLat: -23.55052,
    fromLong: -46.633309,
    toLat: -23.5489,
    toLong: -46.6388,
    passengerId,
    distance: 0,
    fare: 0,
  };

  await expect(
    async () => await RequestRideUsecase.execute(data)
  ).rejects.toThrow(new Error(REQUEST_RIDE_ERROR_MESSAGES.NO_ACCOUNT_FOUND));
});

test("Deve dar erro ao solicitar uma corrida por já ter uma com status 'requested'", async () => {
  const accountId = (await signup(true)).body.id;
  const data: InputRequestRide = {
    fromLat: -23.55052,
    fromLong: -46.633309,
    toLat: -23.5489,
    toLong: -46.6388,
    passengerId: accountId,
    distance: 0,
    fare: 0,
  };
  const response = await RequestRideUsecase.execute(data);

  expect(response).toHaveProperty("id");
  expect(response.passengerId).toBe(accountId);
  expect(response.date).toBeDefined();
  const dataSecondRide: InputRequestRide = {
    fromLat: -23.55052,
    fromLong: -46.633309,
    toLat: -23.5489,
    toLong: -46.6388,
    passengerId: accountId,
    distance: 0,
    fare: 0,
  };

  await expect(
    async () => await RequestRideUsecase.execute(dataSecondRide)
  ).rejects.toThrow(
    new Error(REQUEST_RIDE_ERROR_MESSAGES.ALREADY_REQUESTED_RIDE)
  );
});
