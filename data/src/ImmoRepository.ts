import { IRepository } from "./contracts/IRepository";
import { Flat } from "./models/Flat";
import { SearchQueries } from "./SearchQueries";
const willhaben = require("willhaben");

export class ImmoRepository implements IRepository<Flat> {
  constructor(
    private _initialQuery: SearchQueries,
    private _queryAppendix?: string
  ) {}
  add(item: Flat): void {
    throw new Error("Method not implemented.");
  }

  public set queryAppendix(value: string) {
    this._queryAppendix = value;
  }

  async getAll(): Promise<Flat[]> {
    return willhaben.getListings(`${this._initialQuery}${this._queryAppendix}`);
  }
}
