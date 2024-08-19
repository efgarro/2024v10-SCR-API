import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import { passportUseLocal, passportUseJWT } from "./Config/passportStrats.js";
import { apiRouter } from "./Routers/apiRouter.js";
import { authRouter } from "./Routers/authRouter.js";
import { cognitoAuthRouter } from "./Routers/cognitoAuthRouter.js";

const serverApp = express();
dotenv.config();

// require("dotenv").config();
const PORT = process.env.PORT || 4000;

// serverApp.use(express.static('public'));

// Add middleware for handling CORS requests from index.html
serverApp.use(cors());

// Pass the global passport object into the configuration function
passportUseLocal();
passportUseJWT();

// This will initialize the passport object on every request
serverApp.use(passport.initialize());

// Add middware for parsing request bodies:
serverApp.use(express.json());
serverApp.use(express.urlencoded({ extended: false }));

// Mount routers
serverApp.use("/", authRouter);
serverApp.use("/", apiRouter);
serverApp.use("/", cognitoAuthRouter);

serverApp.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

serverApp.listen(PORT, () => {
  console.log(`serverApp is listening on port ${PORT}`);
});
