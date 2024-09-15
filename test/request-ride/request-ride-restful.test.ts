import request from "supertest";
import app from "../../app";
import { REQUEST_RIDE_ERROR_MESSAGES } from "../../src/constants/signup/errors";
import { IConnection } from "../../src/database/interface-connection";
import { PGConnection } from "../../src/database/pg-connection";
import { InputRequestRide } from "../../src/ride/use-cases/request-ride";
import { signup } from "../helpers/signup-helper";
import { requestRide } from "../helpers/request-ride-helper";

let pgConnection: IConnection;

beforeAll(async () => {
  pgConnection = PGConnection.getInstance();
});
test("Deve dar erro ao pedir por uma corrida por não ser um passageiro", async () => {
  const accountId = (await signup(false)).body.id;
  const data: InputRequestRide = {
    fromLat: -23.55052,
    fromLong: -46.633309,
    toLat: -23.5489,
    toLong: -46.6388,
    passengerId: accountId,
    distance: 0,
    fare: 0,
  };

  const response = await request(app.server)
    .post("/request-ride")
    .send(data)
    .set("Accept", "application/json");

  expect(response.body).toStrictEqual({
    error: REQUEST_RIDE_ERROR_MESSAGES.NOT_A_PASSENGER,
  });
});

test("Deve solicitar uma corrida", async () => {
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
  await requestRide(rideToPost);
});
