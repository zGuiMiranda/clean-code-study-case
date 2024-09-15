import crypto from "crypto";

export enum RIDE_STATUSES {
  COMPLETED = "COMPLETED",
  REQUESTED = "REQUESTED",
}
export class Ride {
  readonly id;
  readonly passengerId: string;
  readonly driverId?: string;
  readonly status: RIDE_STATUSES;
  readonly fare: number;
  readonly distance: number;
  readonly fromLat: number;
  readonly fromLong: number;
  readonly toLat: number;
  readonly toLong: number;
  readonly date: Date;

  constructor({
    id,
    passengerId,
    driverId,
    status,
    distance,
    date,
    fare,
    fromLat,
    fromLong,
    toLat,
    toLong,
  }: {
    id?: string;
    passengerId: string;
    driverId?: string;
    status: RIDE_STATUSES;
    fare: number;
    distance: number;
    fromLat: number;
    fromLong: number;
    toLat: number;
    toLong: number;
    date: Date;
  }) {
    this.id = id || crypto.randomUUID();
    this.passengerId = passengerId;
    this.driverId = driverId;
    this.date = date;
    this.distance = distance;
    this.status = status;
    this.fare = fare;
    this.fromLat = fromLat;
    this.fromLong = fromLong;
    this.toLat = toLat;
    this.toLong = toLong;
  }
}
