import dotenv from "dotenv";
dotenv.config({
  path: "/home/ubuntu/actions-runner-2024v10-scr-api/_work/2024v10-SCR-API/2024v10-SCR-API/.env",
});

// dotenv.config({
//   path: __dirname + "../.env",
// });

import express from "express";
import cors from "cors";
import { scrApiRouter } from "./Routers/scrApiRouter.js";
import { blnApiRouter } from "./Routers/blnApiRouter.js";

const serverApp = express();

// const PORT = process.env.PORT || 4000;
const PORT = 4040;

// Add middleware for handling CORS requests from index.html
serverApp.use(cors());

// Add middware for parsing request bodies:
serverApp.use(express.json());
serverApp.use(express.urlencoded({ extended: false }));

// Mount routers
serverApp.use("/", scrApiRouter);
serverApp.use("/bln", blnApiRouter);

serverApp.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

serverApp.listen(PORT, () => {
  console.log(`serverApp is listening on port ${PORT}`);
  console.log(process.env.PG_USER);
  console.log(process.env.PG_PWD);
});
