export interface IRepository<T> {
  getAll(): Promise<T[]>;
  add(item: T): void;
}
