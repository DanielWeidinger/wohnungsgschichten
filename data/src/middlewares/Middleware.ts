import { RequestHandler } from "express";

export class Middleware {
  constructor(public route: string, public handler: RequestHandler) {}
}
