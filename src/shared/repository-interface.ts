export interface RepositoryInterface<T, R> {
  save(data: T): Promise<R>;
  findById(id: string): Promise<R>;
  findAll(): Promise<R[]>;
  deleteById(id: string): void;
  update(data: T): Promise<R>;
}
