import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { scrApiRouter } from "./Routers/scrApiRouter.js";
import { blnApiRouter } from "./Routers/blnApiRouter.js";

const serverApp = express();

const PORT = process.env.PORT || 4000;


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
});
