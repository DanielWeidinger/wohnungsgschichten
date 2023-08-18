import { Inject, Service } from "typedi";
import { IRepository } from "./contracts/IRepository";
import { Flat } from "./models/Flat";
const willhaben = require("willhaben");

@Service()
export class ImmoRepository implements IRepository<Flat> {
  private constructor(
    @Inject("immo.query") private _initialQuery: string,
    private _queryAppendix?: string
  ) {}

  add(item: Flat): void {
    throw new Error("Method not implemented.");
  }

  public set queryAppendix(value: string) {
    this._queryAppendix = value;
  }

  public set initialQuery(value: string) {
    this._initialQuery = value;
  }

  async getAll(): Promise<Flat[]> {
    return willhaben.getListings(`${this._initialQuery}${this._queryAppendix}`);
  }
}
