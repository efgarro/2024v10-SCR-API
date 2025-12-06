import Router from "express-promise-router";
export const blnApiRouter = Router();
import {
  registerCluster,
  selectClusterToAddImages,
  uploadImageToR2,
  insertImageIntoDB,
  getImageSetStack,
  getCheapQuery,
} from "../RouteHandlers/blnApiHandlers.js";

import { parseImageFile } from "../Utils/parseImageFile.js";

// CMApp

blnApiRouter.post(
  "/image-upload",
  parseImageFile,
  uploadImageToR2.single("file"),
  insertImageIntoDB
);

blnApiRouter.post("/cluster/register", registerCluster);

blnApiRouter.get("/cluster/select_cluster", selectClusterToAddImages);

// BijaLapa Natural Website
blnApiRouter.param("image_cluster_id", (req, res, next, image_cluster_id) => {
  console.log(image_cluster_id);
  req.body.image_cluster_id = image_cluster_id;
  next();
});

blnApiRouter.get("/cluster/cluster_stack/:image_cluster_id", getImageSetStack);

blnApiRouter.get("/cheap-query", getCheapQuery);

blnApiRouter.get("/", (req, res) => {
  return res.status(200).send({ message: "/bln" });
});
