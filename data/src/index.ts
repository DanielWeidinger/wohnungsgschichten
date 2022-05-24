import { ImmoRepository } from "./ImmoRepository";
import { ImmoScrapper } from "./ImmoScrapper";
import { MongoRepository } from "./MongoRepository";
import { SearchQueries } from "./SearchQueries";

const immoRepo = new ImmoRepository(
  SearchQueries.SELECTED_DISTRICS_BETWEEN_600_AND_1000_3ROOMS
);
const mongoRepo = new MongoRepository(
  `mongodb+srv://weidinger:${process.env.WOHNUNGSGSCHICHTEN_ATLAS_PW}@cluster0.sh9uc.mongodb.net/?retryWrites=true&w=majority`
);
const scrapper = new ImmoScrapper(immoRepo, mongoRepo);

(async () => {
  const result = await scrapper.gatherAll();
  console.log(result.length);
  mongoRepo.closeConnection();
})();
