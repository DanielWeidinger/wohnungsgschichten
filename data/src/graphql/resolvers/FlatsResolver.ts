import { Int, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { ImmoScrapper } from "../../ImmoScrapper";
import { MongoRepository } from "../../MongoRepository";
import { FlatQL } from "../types/Flat";

@Service()
@Resolver(FlatQL)
export class FlatsResolver {
  constructor(
    private readonly mongoRepo: MongoRepository,
    private immoScrapper: ImmoScrapper
  ) {}

  @Query((returns) => [FlatQL], { nullable: true })
  async flats() {
    const result = (await this.mongoRepo.getAllFlats()) as FlatQL[];
    return result;
  }

  @Query((returns) => [FlatQL], { nullable: true })
  async latestFlats() {
    const result = (await this.mongoRepo.getLatestFlats()) as FlatQL[];
    return result;
  }

  @Mutation((returns) => Int)
  async fetchLatestFlats() {
    const result = await this.immoScrapper.gatherAll();
    return result.length;
  }
}
