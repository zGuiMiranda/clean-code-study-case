import { RIDE_STATUSES } from "../domain/ride.entity";

export interface RideRepositoryInterface<T, R> {
  save(data: T): Promise<void>;
  findByAccountIdAndStatus(id: string, status: RIDE_STATUSES[]): Promise<R>;
  findById(id: string): Promise<R>;
}
