export const ERROR_MESSAGES = {
  INVALID_EMAIL: "Email inválido",
  INVALID_NAME: "Nome inválido",
  INVALID_CPF: "CPF inválido",
  INVALID_PASSWORD: "Senha inválida",
  INVALID_CAR_PLATE: "Placa do carro inválida",
  ACCOUNT_EXISTS: "Conta existente",
} as const;

export const REQUEST_RIDE_ERROR_MESSAGES = {
  NO_ACCOUNT_FOUND: "Conta não encontrada",
  NOT_A_PASSENGER: "O usuário não é um passageiro",
  ALREADY_REQUESTED_RIDE: "Usuário já tem corrida solicitada",
};

export const GET_RIDE_ERROR_MESSAGES = {
  NO_RIDE_FOUND: "Corrida não encontrada",
};
