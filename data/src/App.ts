import express, { Application } from "express";
import { Service } from "typedi";
import { IController } from "./contracts/IController";
import { Middleware } from "./middlewares/Middleware";

@Service()
export class App {
  app: Application;
  port: number;
  constructor(
    port: number,
    controllers: IController[],
    middlewares: Middleware[]
  ) {
    this.app = express();
    this.port = port;

    this.middlewares(middlewares);
    this.routes(controllers);
  }

  private middlewares(middlewares: Middleware[]) {
    middlewares.forEach((middleware) => {
      this.app.use(middleware.route, middleware.handler);
    });
  }
  private routes(controllers: IController[]) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }
  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server is listening to http://localhost:${this.port}`);
    });
  }
}
