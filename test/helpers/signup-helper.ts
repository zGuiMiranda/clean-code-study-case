import { faker } from "@faker-js/faker";
import request from "supertest";
import app from "../../app";
import { STATUSES_CODE } from "../../src/constants/http/statuses";

export const signup = async (
  isPassenger = false
): Promise<{ body: { id: string } }> => {
  const email = faker.internet.email();
  const name = faker.person.fullName();
  const password = faker.internet.password();

  const response = await request(app.server)
    .post("/signup")
    .send({
      name,
      email,
      cpf: "125.721.640-60",
      isDriver: true,
      carPlate: "ABC1234",
      isPassenger,
      password,
    })
    .set("Accept", "application/json");
  expect(response.status).toBe(STATUSES_CODE.SUCCESS_CREATION);
  expect(response.body).toHaveProperty("id");
  return response;
};
