import { Collection, Db, MongoClient } from "mongodb";
import Container, { Service } from "typedi";
import { IRepository } from "./contracts/IRepository";
import { Flat } from "./models/Flat";
import { Update } from "./models/Update";

@Service({ factory: MongoRepository.init })
export class MongoRepository implements IRepository<Flat> {
  private client?: MongoClient;
  private db?: Db;
  private flatsCollection?: Collection<Flat>;
  private updatesCollection?: Collection<Update>;

  constructor() {}

  static init(): MongoRepository {
    const repo = new MongoRepository();
    repo.client = Container.get("mongo.client");
    repo.db = repo.client?.db("flats");
    repo.flatsCollection = repo.db?.collection<Flat>("flats");
    repo.updatesCollection = repo.db?.collection<Update>("updates");
    return repo;
  }

  getAll(): Promise<Flat[]> {
    throw new Error("Method not implemented.");
  }

  async getAllFlats() {
    return await this.flatsCollection?.find().toArray();
  }

  async getLatestFlats() {
    const lastCheck = (await this.updatesCollection
      ?.find()
      .sort({ timestamp: -1 })
      .limit(1)
      .toArray()) as Update[];

    const result = await this.flatsCollection
      ?.find({
        lastCheck: lastCheck[0].timestamp,
      })
      .toArray();

    return result as Flat[];
  }

  async add(item: Flat): Promise<void> {
    const result = await this.flatsCollection?.insertOne(item);
    console.log(result);
  }

  async insertUpdate(value: Update) {
    const result = await this.updatesCollection?.insertOne(value);
  }

  async insertIfMissing(
    item: Flat,
    lastCheck: Date
  ): Promise<{ upserted: number; updated: number }> {
    const result = await this.flatsCollection?.updateOne(
      { id: item.id },
      { $set: { lastCheck: lastCheck }, $setOnInsert: item },
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
