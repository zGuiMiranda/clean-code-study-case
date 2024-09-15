import request from "supertest";
import app from "../../app";
import { InputRequestRide } from "../../src/ride/use-cases/request-ride";

export const requestRide = async ({
  fromLat,
  fromLong,
  toLat,
  toLong,
  passengerId,
  distance,
  fare,
  driverId,
}: InputRequestRide): Promise<{ body: { id: string } }> => {
  const data: InputRequestRide = {
    fromLat,
    fromLong,
    toLat,
    toLong,
    passengerId,
    distance,
    fare,
    driverId,
  };

  const response = await request(app.server)
    .post("/request-ride")
    .send(data)
    .set("Accept", "application/json");

  expect(response.body).toHaveProperty("id");
  expect(response.body.passengerId).toBe(passengerId);
  return response;
};
