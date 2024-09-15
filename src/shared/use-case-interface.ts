export interface UseCaseInterface<T, R> {
  execute(data: T): Promise<R>;
}
