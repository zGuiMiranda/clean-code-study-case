import { faker } from "@faker-js/faker";
import { GET_RIDE_ERROR_MESSAGES } from "../../src/constants/signup/errors";
import { IConnection } from "../../src/database/interface-connection";
import { PGConnection } from "../../src/database/pg-connection";
import { RideRepository } from "../../src/ride/repository/ride-repository";
import GetRideData, {
  InputGetRideData,
  OutputGetRideData,
} from "../../src/ride/use-cases/get-ride-data";
import { UseCaseInterface } from "../../src/shared/use-case-interface";
import { requestRide } from "../helpers/request-ride-helper";
import { signup } from "../helpers/signup-helper";
import { RIDE_STATUSES } from "../../src/ride/domain/ride.entity";

let pgConnection: IConnection;
let GetRideDataUsecase: UseCaseInterface<InputGetRideData, OutputGetRideData>;

beforeAll(async () => {
  pgConnection = PGConnection.getInstance();

  GetRideDataUsecase = new GetRideData(new RideRepository(pgConnection));
});

test("Deve dar erro ao recuperar as informações de uma corrida por id por não encontrar a corrida", async () => {
  const id = faker.string.uuid();
  const data: { id: string } = { id };
  await expect(
    async () => await GetRideDataUsecase.execute(data)
  ).rejects.toThrow(new Error(GET_RIDE_ERROR_MESSAGES.NO_RIDE_FOUND));
});

test("Deve recuperar as informações da corrida", async () => {
  const accountId = (await signup(true)).body.id;

  const rideToPost = {
    fromLat: -23.55052,
    fromLong: -46.633309,
    toLat: -23.5489,
    toLong: -46.6388,
    passengerId: accountId,
    distance: 0,
    fare: 0,
  };
  const ridePostResponse = await requestRide(rideToPost);

  const rideData = await GetRideDataUsecase.execute({
    id: ridePostResponse.body.id,
  });

  expect(rideData).toHaveProperty("id");
  expect(rideData).toHaveProperty("date");
  expect(rideData.id).toBeDefined();
  expect(rideData.date).toBeDefined();

  expect({
    passengerId: rideData.passengerId,
    toLat: rideData.toLat,
    toLong: rideData.toLong,
    fromLat: rideData.fromLat,
    fromLong: rideToPost.fromLong,
    distance: rideData.distance,
    fare: rideData.fare,
    status: rideData.status,
    id: rideData.id,
  }).toMatchObject({
    passengerId: rideToPost.passengerId,
    toLat: rideToPost.toLat,
    toLong: rideToPost.toLong,
    fromLat: rideToPost.fromLat,
    fromLong: rideToPost.fromLong,
    distance: rideToPost.distance,
    fare: rideToPost.fare,
    status: RIDE_STATUSES.REQUESTED,
    id: ridePostResponse.body.id,
  });
});
