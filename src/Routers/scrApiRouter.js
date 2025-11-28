import Router from "express-promise-router";
import {
  registerPlace,
  insertImageIntoDB,
  uploadImageToR2,
  getImageSetStack,
  updateImageSetStack,
  selectPlaceToAddImages,
} from "../RouteHandlers/scrApiHandlers.js";

import { parseImageFile } from "../Utils/parseImageFile.js";

export const scrApiRouter = Router();

scrApiRouter.param("image_set_id", (req, res, next, image_set_id) => {
  req.body.image_set_id = image_set_id;
  next();
});

scrApiRouter.post(
  "/upload",
  parseImageFile,
  uploadImageToR2.single("file"),
  insertImageIntoDB
);

scrApiRouter.post("/register/place", registerPlace);

scrApiRouter.get(
  "/register/place/image_set_stack/:image_set_id",
  getImageSetStack
);
scrApiRouter.post("/register/place/image_set_stack", updateImageSetStack);

scrApiRouter.get("/register/place/images/select_place", selectPlaceToAddImages);

