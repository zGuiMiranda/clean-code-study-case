DROP SCHEMA IF EXISTS ccca CASCADE;

CREATE SCHEMA ccca;

CREATE TABLE ccca.account (
    account_id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    cpf TEXT NOT NULL,
    car_plate TEXT NULL,
    is_passenger BOOLEAN NOT NULL DEFAULT FALSE,
    is_driver BOOLEAN NOT NULL DEFAULT FALSE,
    password TEXT NOT NULL
);

CREATE TABLE ccca.ride (
    ride_id UUID PRIMARY KEY,
    passenger_id UUID,
    driver_id UUID,
    status TEXT,
    fare NUMERIC,
    distance NUMERIC,
    from_lat NUMERIC,
    from_long NUMERIC,
    to_lat NUMERIC,
    to_long NUMERIC,
    date TIMESTAMP,
    CONSTRAINT fk_passenger
        FOREIGN KEY (passenger_id) REFERENCES ccca.account(account_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_driver
        FOREIGN KEY (driver_id) REFERENCES ccca.account(account_id)
        ON DELETE CASCADE
);