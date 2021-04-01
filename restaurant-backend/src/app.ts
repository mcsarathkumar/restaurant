import dotenv from "dotenv";

dotenv.config({path: __dirname + '/.env'});

import express from "express";
import path from "path";
import bodyParser from "body-parser";
import cors from "cors";
import crypto from "crypto";

import { UserRoutes } from "./routes/user.route";
import { SharedFunction } from "./configs/functions";
import {RestaurantRoutes} from "./routes/restaurant.route";
import {ReviewRoutes} from "./routes/review.route";

export const app: express.Application = express();
if (!SharedFunction.isDevMode()) {
  // @ts-ignore
  process.env.APP_JWT_KEY = crypto.createHash(process.env.APP_HASH_ALGO).update(Date.now() + process.env.APP_PASSWORD_SALT).digest("hex");
}

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", express.static(path.join(__dirname, "frontend")));

// app.use("/api/posts", postsRoutes);
app.use("/api", UserRoutes);
app.use("/api/restaurant", RestaurantRoutes);
app.use("/api/review", ReviewRoutes);

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});
