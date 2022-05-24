import { Collection, Db, MongoClient } from "mongodb";
import { IRepository } from "./contracts/IRepository";
import { Flat } from "./models/Flat";
import { Update } from "./models/Update";

export class MongoRepository implements IRepository<Flat> {
  private client?: MongoClient;
  private db?: Db;
  private flatsCollection?: Collection;
  private updatesCollection?: Collection;

  constructor(private connectionString: string) {}

  async init() {
    this.client = await MongoClient.connect(this.connectionString);
    this.db = this.client?.db("flats");
    this.flatsCollection = this.db.collection("flats");
    this.updatesCollection = this.db.collection("updates");
  }

  getAll(): Promise<Flat[]> {
    throw new Error("Method not implemented.");
  }

  async add(item: Flat): Promise<void> {
    const result = await this.flatsCollection?.insertOne(item);
    console.log(result);
  }

  async insertUpdate(value: Update) {
    if (!this.updatesCollection) await this.init();
    const result = await this.updatesCollection?.insertOne(value);
  }

  async insertIfMissing(
    item: Flat
  ): Promise<{ upserted: number; updated: number }> {
    if (!this.flatsCollection) await this.init();

    const result = await this.flatsCollection?.updateOne(
      { id: item.id },
      { $setOnInsert: item },
      { upsert: true }
    );

    return {
      upserted: result?.upsertedCount ?? -1,
      updated: result?.matchedCount ?? -1,
    };
  }

  closeConnection() {
    this.client?.close();
  }
}
