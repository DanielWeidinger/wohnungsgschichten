import "reflect-metadata";
import bodyParser from "body-parser";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "type-graphql";
import Container from "typedi";
import { App } from "./App";
import { FlatsResolver } from "./graphql/resolvers/FlatsResolver";
import { Middleware } from "./middlewares/Middleware";
import { MongoClient } from "mongodb";
import { SearchQueries } from "./SearchQueries";

(async () => {
  Container.set(
    "mongo.client",
    await MongoClient.connect(
      `mongodb+srv://weidinger:${process.env.WOHNUNGSGSCHICHTEN_ATLAS_PW}@cluster0.sh9uc.mongodb.net/?retryWrites=true&w=majority`
    )
  );
  Container.set(
    "immo.query",
    SearchQueries.SELECTED_DISTRICS_BETWEEN_600_AND_1000_3ROOMS
  );

  const app = new App(
    4000,
    [],
    [
      new Middleware("/", bodyParser.json()),
      new Middleware(
        "/graphql",
        graphqlHTTP({
          graphiql: true,
          schema: await buildSchema({
            resolvers: [FlatsResolver],
            container: Container,
          }),
        })
      ),
    ]
  );

  app.listen();
})();
