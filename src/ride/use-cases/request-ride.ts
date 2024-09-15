import { AccountRepositoryInterface } from "../../account/repository/account-repository-interface";
import { REQUEST_RIDE_ERROR_MESSAGES } from "../../constants/signup/errors";
import { UseCaseInterface } from "../../shared/use-case-interface";
import { Account } from "../../signup/domain/account.entity";
import { Ride, RIDE_STATUSES } from "../domain/ride.entity";
import { RideRepositoryInterface } from "../repository/ride-repository-interface";

export type InputRequestRide = {
  passengerId: string;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
  driverId?: string;
  distance: number;
  fare: number;
};

export type OutputRequestRide = {
  id: string;
  status: RIDE_STATUSES;
  passengerId: string;
  date: Date;
};

export default class RequestRide
  implements UseCaseInterface<InputRequestRide, OutputRequestRide>
{
  private rideRepository: RideRepositoryInterface<Ride, Ride | Ride[]>;
  private accountRepository: AccountRepositoryInterface<Account>;
  constructor(
    rideRepository: RideRepositoryInterface<Ride, Ride | Ride[]>,
    accountRepository: AccountRepositoryInterface<Account>
  ) {
    this.rideRepository = rideRepository;
    this.accountRepository = accountRepository;
  }
  async execute(data: InputRequestRide): Promise<OutputRequestRide> {
    const account = await this.accountRepository.getById(data.passengerId);

    if (!account) throw new Error(REQUEST_RIDE_ERROR_MESSAGES.NO_ACCOUNT_FOUND);

    if (!account.isPassenger)
      throw new Error(REQUEST_RIDE_ERROR_MESSAGES.NOT_A_PASSENGER);

    const accountRides = await this.rideRepository.findByAccountIdAndStatus(
      data.passengerId,
      [RIDE_STATUSES.REQUESTED]
    );

    if ((accountRides as Ride[]).length)
      throw new Error(REQUEST_RIDE_ERROR_MESSAGES.ALREADY_REQUESTED_RIDE);
    const ride = new Ride({
      passengerId: data.passengerId,
      date: new Date(),
      distance: data.distance,
      fare: data.fare,
      fromLat: data.fromLat,
      fromLong: data.fromLong,
      toLat: data.toLat,
      toLong: data.toLong,
      status: RIDE_STATUSES.REQUESTED,
    });
    await this.rideRepository.save(ride);
    return {
      id: ride.id,
      passengerId: ride.passengerId,
      status: ride.status,
      date: ride.date,
    };
  }
}
