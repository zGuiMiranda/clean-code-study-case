import { IConnection } from "../../database/interface-connection";
import { Ride, RIDE_STATUSES } from "../domain/ride.entity";
import { RideRepositoryInterface } from "./ride-repository-interface";

type Model = {
  ride_id: string;
  passenger_id: string;
  driver_id: string;
  status: string;
  fare: number;
  distance: number;
  from_lat: number;
  from_long: number;
  to_lat: number;
  to_long: number;
  date: Date;
};

export class RideRepository
  implements RideRepositoryInterface<Ride, Ride | Ride[]>
{
  constructor(private connection: IConnection) {
    this.connection = connection;
  }

  async findById(id: string): Promise<Ride> {
    const [response]: Model[] = await this.connection.query(
      "SELECT * FROM ccca.ride WHERE ride_id = $1",
      [id]
    );
    return this.transformToDomain(response);
  }

  async findByAccountIdAndStatus(
    passengerId: string,
    statuses: RIDE_STATUSES[]
  ): Promise<Ride[]> {
    const response: Model[] = await this.connection.query(
      "SELECT * FROM ccca.ride WHERE passenger_id = $1 AND status = ANY($2::text[])",
      [passengerId, statuses]
    );
    return response.map(this.transformToDomain);
  }

  async save({
    passengerId,
    date,
    distance,
    fare,
    fromLat,
    fromLong,
    id,
    status,
    toLat,
    toLong,
  }: Ride): Promise<void> {
    await this.connection.query(
      "insert into ccca.ride (ride_id, passenger_id, status, fare, to_lat, to_long, from_lat, from_long, date, distance) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
      [
        id,
        passengerId,
        status,
        fare,
        toLat,
        toLong,
        fromLat,
        fromLong,
        date,
        distance,
      ]
    );
  }

  transformToDomain = (value: Model) => {
    return (
      value &&
      new Ride({
        id: value.ride_id,
        passengerId: value.passenger_id,
        driverId: value.driver_id,
        status:
          (value.status as RIDE_STATUSES.COMPLETED) || RIDE_STATUSES.REQUESTED,
        date: value.date,
        distance: +value.distance,
        fare: +value.fare,
        fromLat: +value.from_lat,
        fromLong: +value.from_long,
        toLat: +value.to_lat,
        toLong: +value.to_long,
      })
    );
  };
}
