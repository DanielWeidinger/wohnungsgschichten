import { Service } from "typedi";
import { IScrapper } from "./contracts/IScrapper";
import { ImmoRepository } from "./ImmoRepository";
import { Flat } from "./models/Flat";
import { MongoRepository } from "./MongoRepository";

@Service()
export class ImmoScrapper implements IScrapper<Flat> {
  constructor(
    private sourceRepo: ImmoRepository,
    private destRepo: MongoRepository
  ) {}

  private async insertIfMissing(flats: Flat[], lastCheck: Date) {
    let upserted = 0;
    let updated = 0;

    for (let i = 0; i < flats.length; i++) {
      // flats[i].lastCheck = lastCheck;

      const count = await this.destRepo.insertIfMissing(flats[i], lastCheck);
      if (count.upserted != 0) {
        upserted++;
      }
      if (count.updated != 0) {
        updated++;
      }
    }
    console.log(`Inserted ${upserted} into mongo`);
    console.log(`Updated ${updated} into mongo`);
  }

  async gatherAll() {
    let result: Flat[] = [];
    let current_page = 1;
    const currentDate = new Date(Date.now());
    await this.destRepo.insertUpdate({ timestamp: currentDate });

    this.sourceRepo.queryAppendix = `&page=${current_page}`;
    let current: Flat[] = await this.sourceRepo.getAll();
    await this.insertIfMissing(current, currentDate);
    while (current.length != 0) {
      result.push(...current);
      console.log(`${current_page} -> read ${current.length}`);
      current_page++;
      this.sourceRepo.queryAppendix = `&page=${current_page}`;
      current = await this.sourceRepo.getAll();
      await this.insertIfMissing(current, currentDate);
    }

    return result;
  }
}
