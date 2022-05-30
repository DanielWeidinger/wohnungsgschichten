import { Collection, Db, MongoClient } from 'mongodb';

export class Repository {
  private client?: MongoClient;
  private db?: Db;
  private flatsCollection?: Collection;
  private updatesCollection?: Collection;

  constructor(private connectionString: string) {}

  async init() {
    this.client = await MongoClient.connect(this.connectionString);
    this.db = this.client?.db('flats');
    this.flatsCollection = this.db.collection('flats');
    this.updatesCollection = this.db.collection('updates');
  }

  async getAll() {
    const latestUpdate = await this.updatesCollection
      ?.find()
      .sort({ timestamp: -1 })
      .limit(1)
      .toArray();

    const result = await this.flatsCollection
      ?.find({ lastCheck: latestUpdate })
      .toArray();

    if (result) {
      console.log(result[1]);
    }
    return result;
  }
}
