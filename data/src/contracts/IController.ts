import { Router } from "express";

export interface IController {
  router: Router;
  initRoutes(): void;
}
