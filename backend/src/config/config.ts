import dotenv, { DotenvConfigOptions } from "dotenv";

import { ConfigType } from "../types/config";

export default class Config {
  private static instance: Config;

  public params: ConfigType;

  private constructor() {
    const dotenvConfigOptions: DotenvConfigOptions = {
      path: `${__dirname}/../../.env`,
    };
    dotenv.config(dotenvConfigOptions);

    this.params = {
      apiPort:
        process.env.STATUS === "dev"
          ? process.env.DEV_PORT!
          : process.env.PROD_PORT!,
      mongodbUrl:
        process.env.STATUS === "dev"
          ? process.env.DEV_DB!
          : process.env.PROD_DB!,
      secretKey:
        process.env.STATUS === "dev"
          ? process.env.DEV_SECRET_KEY!
          : process.env.PROD_SECRET_KEY!,
    };
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Config();
    }
    return this.instance;
  }
}
