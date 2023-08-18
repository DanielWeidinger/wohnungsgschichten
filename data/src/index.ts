import "reflect-metadata";
import bodyParser from "body-parser";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "type-graphql";
import Container from "typedi";
import { App } from "./App";
import { FlatsResolver } from "./graphql/resolvers/FlatsResolver";
import { Middleware } from "./middlewares/Middleware";
import { MongoClient } from "mongodb";
import searchQueries from "./search_queries.json";

(async () => {
  require("dotenv").config();

  Container.set(
    "mongo.client",
    await MongoClient.connect(process.env.MONGO_CONNECTION_STRING ?? "")
  );
  console.log(process.env.SEARCH_QUERY);
  if (process.env.SEARCH_QUERY && process.env.SEARCH_QUERY in searchQueries) {
    // @ts-ignore
    Container.set("immo.query", searchQueries[process.env.SEARCH_QUERY]);
  } else {
    throw new Error("Search query not found");
  }

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
