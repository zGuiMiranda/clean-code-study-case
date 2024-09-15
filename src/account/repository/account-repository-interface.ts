export interface AccountRepositoryInterface<T> {
  getById(id: string): Promise<T>;
}
