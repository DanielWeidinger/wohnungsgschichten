export interface IScrapper<T> {
  gatherAll(): Promise<T[]>;
}
