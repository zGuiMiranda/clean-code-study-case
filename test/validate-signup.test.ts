import request from "supertest";
import app from "../app";
import { PGConnection } from "../src/database/pg-connection";
import { faker } from "@faker-js/faker";
import { ERROR_MESSAGES } from "../src/constants/signup/errors";

let pgConnection: PGConnection;

beforeAll(async () => {
  pgConnection = PGConnection.getInstance();
});

afterAll(async () => {
  if (pgConnection) {
    await pgConnection.deleteAll();
    await pgConnection.end();
  }
});

test("Deve dar erro ao cadastrar uma conta por causa de nome inválido", async () => {
  const response = await request(app.server)
    .post("/signup")
    .send()
    .set("Accept", "application/json");

  expect(response.status).toBe(500);
  expect(response.body).toStrictEqual({ error: ERROR_MESSAGES.INVALID_NAME });
});

test("Deve dar erro ao cadastrar uma conta por causa de email inválido", async () => {
  const response = await request(app.server)
    .post("/signup")
    .send({ name: "Gwyn Owl" })
    .set("Accept", "application/json");

  expect(response.status).toBe(500);
  expect(response.body).toStrictEqual({ error: ERROR_MESSAGES.INVALID_EMAIL });
});

test("Deve dar erro ao cadastrar uma conta por causa de cpf inválido", async () => {
  const response = await request(app.server)
    .post("/signup")
    .send({ name: "Gwyn Owl", email: faker.internet.email(), cpf: "1" })
    .set("Accept", "application/json");

  expect(response.status).toBe(500);
  expect(response.body).toStrictEqual({ error: ERROR_MESSAGES.INVALID_CPF });
});

test("Deve dar erro ao cadastrar uma conta por causa de placa nula", async () => {
  const response = await request(app.server)
    .post("/signup")
    .send({
      name: "Gwyn Owl",
      email: faker.internet.email(),
      cpf: "125.721.640-60",
      isDriver: true,
      carPlate: null,
      password: "4",
    })
    .set("Accept", "application/json");

  expect(response.status).toBe(500);
  expect(response.body).toStrictEqual({
    error: ERROR_MESSAGES.INVALID_CAR_PLATE,
  });
});

test("Deve dar erro ao cadastrar uma conta por causa de placa inválida", async () => {
  const response = await request(app.server)
    .post("/signup")
    .send({
      name: "Gwyn Owl",
      email: faker.internet.email(),
      cpf: "125.721.640-60",
      isDriver: true,
      carPlate: "amem",
      password: "41",
    })
    .set("Accept", "application/json");

  expect(response.status).toBe(500);
  expect(response.body).toStrictEqual({
    error: ERROR_MESSAGES.INVALID_CAR_PLATE,
  });
});

test("Deve dar erro ao cadastrar uma conta por causa de senha inválida", async () => {
  const response = await request(app.server)
    .post("/signup")
    .send({
      name: "Gwyn Owl",
      email: faker.internet.email(),
      cpf: "125.721.640-60",
      isDriver: true,
      carPlate: "amem",
    })
    .set("Accept", "application/json");

  expect(response.status).toBe(500);
  expect(response.body).toStrictEqual({
    error: ERROR_MESSAGES.INVALID_PASSWORD,
  });
});

test("Deve cadastrar uma conta", async () => {
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
      isPassenger: false,
      password,
    })
    .set("Accept", "application/json");

  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("id");

  const responseConsulta = await request(app.server)
    .get(`/getAccount/${email}`)
    .send({
      name: "Gwyn Owl",
      email,
      cpf: "125.721.640-60",
      isDriver: true,
      carPlate: "ABC1234",
      isPassenger: false,
      password: "teste",
    })
    .set("Accept", "application/json");

  expect(responseConsulta.status).toBe(200);
  expect(responseConsulta.body).toHaveProperty("id");
  expect(responseConsulta.body).toEqual(
    expect.objectContaining({
      email: email,
      name: name,
      password: password,
    })
  );
});

test("Deve cadastrar uma conta e dar erro na consulta", async () => {
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
      isPassenger: false,
      password,
    })
    .set("Accept", "application/json");

  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("id");

  const responseConsulta = await request(app.server)
    .get(`/getAccount/${"testeemailinvalido"}`)
    .set("Accept", "application/json");

  expect(responseConsulta.status).toBe(500);
  expect(responseConsulta.body).toStrictEqual({
    error: ERROR_MESSAGES.INVALID_EMAIL,
  });
});

test("Deve cadastrar uma conta e dar erro na consulta email nulo", async () => {
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
      isPassenger: false,
      password,
    })
    .set("Accept", "application/json");

  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("id");

  const responseConsulta = await request(app.server)
    .get(`/getAccount/${null}`)
    .set("Accept", "application/json");

  expect(responseConsulta.status).toBe(500);
  expect(responseConsulta.body).toStrictEqual({
    error: ERROR_MESSAGES.INVALID_EMAIL,
  });
});
test("Deve dar erro de conta existente", async () => {
  const email = faker.internet.email();
  const response = await request(app.server)
    .post("/signup")
    .send({
      name: "Gwyn Owl",
      email,
      cpf: "125.721.640-60",
      isDriver: true,
      carPlate: "ABC1234",
      isPassenger: false,
      password: "teste",
    })
    .set("Accept", "application/json");

  expect(response.status).toBe(200);

  const responseContaExistente = await request(app.server)
    .post("/signup")
    .send({
      name: "Gwyn Owl",
      email,
      cpf: "125.721.640-60",
      isDriver: true,
      carPlate: "ABC1234",
      isPassenger: false,
      password: "teste",
    })
    .set("Accept", "application/json");

  expect(responseContaExistente.status).toBe(500);
  expect(responseContaExistente.body).toStrictEqual({
    error: ERROR_MESSAGES.ACCOUNT_EXISTS,
  });
});
