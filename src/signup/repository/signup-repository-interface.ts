export interface SignupRepositoryInterface<T, R> {
  getByEmail(email: string): Promise<T>;
  signup(data: T): void;
  transformToDomain(dataFromDatabase: R): T;
}
