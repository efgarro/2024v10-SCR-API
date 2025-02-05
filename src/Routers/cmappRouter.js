import Router from "express-promise-router";
import { cognitoExpress } from "../Config/cognitoExpress.js";
import { parseImageFile, uploadToR2 } from "../RouteHandlers/cmAppHandlers.js";

export const cmAppRouter = Router();

/*
//Our middleware that authenticates all APIs under our 'cmAppRouter' Router
cmAppRouter.use(function (req, res, next) {
  //I'm passing in the access token in header under key accessToken
  let accessTokenFromClient = req.headers.accesstoken;
  //Fail if token not present in header.
  if (!accessTokenFromClient)
    return res.status(401).send("Access Token missing from header");

  cognitoExpress.validate(accessTokenFromClient, function (err, response) {
    //If API is not authenticated, Return 401 with error message.
    if (err) return res.status(401).send(err);

    //Else API has been authenticated. Proceed.
    res.locals.user = response;
    next();
  });
});
*/

cmAppRouter.get("/myfirstcognito", function (req, res, next) {
  console.log("Hellow");
  res.send(`Hi ${res.locals.user.username}, your API call is authenticated!`);
});

cmAppRouter.post(
  "/upload",
  parseImageFile,
  uploadToR2.single("file"),
  (req, res) => {
    console.log(req.body);
    res.send("Thanx");
  }
);
