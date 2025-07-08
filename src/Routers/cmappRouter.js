import Router from "express-promise-router";
import { cognitoExpress } from "../Config/cognitoExpress.js";
import {
  parseImageFile,
  insertImageIntoDB,
  uploadImageToR2,
  getImageSetStack,
  updateImageSetStack,
} from "../RouteHandlers/cmAppHandlers.js";

import { registerPlace } from "../RouteHandlers/cmAppHandlers.js";

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

cmAppRouter.param("image_set_id", (req, res, next, image_set_id) => {
  req.body.image_set_id = image_set_id;
  next();
});

cmAppRouter.get("/myfirstcognito", function (req, res, next) {
  console.log("Hellow");
  res.send(`Hi ${res.locals.user.username}, your API call is authenticated!`);
});

cmAppRouter.post(
  "/upload",
  parseImageFile,
  uploadImageToR2.single("file"),
  insertImageIntoDB
  // (req, res) => {
  //   console.log("MW 3");
  //   console.log(req.body);
  //   console.log(req.file);
  //   res.json({ url: `https://r2storage.soy-cr.com/${req.file.key}` });
  // }
);

// cmAppRouter.post("/register/place", registerNewLodge, (req, res) => {
//   res.send({ success: true, message: "Lodge Created" });
// });
cmAppRouter.post("/register/place", registerPlace);

cmAppRouter.get(
  "/register/place/image_set_stack/:image_set_id",
  getImageSetStack
);
cmAppRouter.post("/register/place/image_set_stack", updateImageSetStack);

cmAppRouter.get("/hellow)", (req, res) => {
  console.log(req);
  res.status(200).send("Hellow Bella");
});
