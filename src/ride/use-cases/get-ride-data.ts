import { GET_RIDE_ERROR_MESSAGES } from "../../constants/signup/errors";
import { UseCaseInterface } from "../../shared/use-case-interface";
import { Ride, RIDE_STATUSES } from "../domain/ride.entity";
import { RideRepositoryInterface } from "../repository/ride-repository-interface";

export type InputGetRideData = {
  id: string;
};

export type OutputGetRideData = {
  id: string;
  status: RIDE_STATUSES;
  passengerId: string;
  date: Date;
  fare: number;
  distance: number;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
  driverId?: string;
};

export default class GetRideData
  implements UseCaseInterface<InputGetRideData, OutputGetRideData>
{
  private rideRepository: RideRepositoryInterface<Ride, Ride | Ride[]>;
  constructor(rideRepository: RideRepositoryInterface<Ride, Ride | Ride[]>) {
    this.rideRepository = rideRepository;
  }
  async execute(data: InputGetRideData): Promise<OutputGetRideData> {
    const rideInfo = (await this.rideRepository.findById(data.id)) as Ride;
    if (!rideInfo) throw new Error(GET_RIDE_ERROR_MESSAGES.NO_RIDE_FOUND);

    return {
      date: rideInfo.date,
      distance: rideInfo.distance,
      fare: rideInfo.fare,
      driverId: rideInfo.driverId,
      fromLat: rideInfo.fromLat,
      fromLong: rideInfo.fromLong,
      id: rideInfo.id,
      passengerId: rideInfo.passengerId,
      status: rideInfo.status,
      toLat: rideInfo.toLat,
      toLong: rideInfo.toLong,
    };
  }
}
