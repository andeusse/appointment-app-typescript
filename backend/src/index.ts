require("./models/User");

import express, { Express } from "express";
import cors from "cors";
import { json } from "body-parser";

import { MongoDB } from "./database/mongo";

import { handleError } from "./middlewares/errorHandler/ErrorHandlerMiddleware";

import authRoutes from "./routes/authRoutes";
import statusRoutes from "./routes/statusRoutes";
import Config from "./config/config";

const app: Express = express();
const port = Config.getInstance().params.apiPort;

app.use(json());
app.use(cors());

app.use(authRoutes);
app.use(statusRoutes);

app.use(handleError);

const mongoDB = MongoDB.getInstance();
mongoDB.mongoUri = Config.getInstance().params.mongodbUrl;

mongoDB.start();

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
