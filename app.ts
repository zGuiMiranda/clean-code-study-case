import express from "express";
import { router as signupRoutes } from "./src/signup/routes/routes";

class App {
  public server: express.Application;
  constructor() {
    this.server = express();
    this.middleware();
    this.routes();
  }

  routes() {
    this.server.use("/", signupRoutes);
  }

  middleware() {
    this.server.use(express.json());
  }
}

export default new App();
