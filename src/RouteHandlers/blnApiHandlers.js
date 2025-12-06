import { blnQuery } from "../Config/postgresPool.js";

import multer from "multer";
import { storageR2 } from "../Config/multer.js";

export const uploadImageToR2 = multer({
  storage: storageR2("2025v12-bijalapa"),
});

export const registerCluster = async (req, res, next) => {
  console.log(req.body);
  const { name } = req.body;
  try {
    const record = await blnQuery(`SELECT register_image_cluster($1)`, [name]);
    res.send(record.rows[0].register_cluster[0]);
  } catch (err) {
    console.log(err);
  }
};

export const selectClusterToAddImages = async (req, res) => {
  let response;
  try {
    response = await blnQuery(`SELECT * FROM bln_image_clusters`);
  } catch (err) {
    console.log(err);
  }
  res.status(200).json(response.rows);
};

export const insertImageIntoDB = async (req, res) => {
  const { image_id, image_cluster_id, orientation } = req.body;
  const { key } = req.file;
  const url = `https://r2storage.bijalapa.com/${key}`;
  try {
    const response = await blnQuery(
      `SELECT insert_image_into_db($1, $2, $3, $4, $5)`,
      [image_id, image_cluster_id, key, url, orientation]
    );
    console.log(response);
  } catch (err) {
    console.log(err);
  }
  res.json({ ...req.body, ...req.file, url: url });
};

export const getImageSetStack = async (req, res) => {
  console.log(req.body.image_cluster_id);
  let response;
  try {
    response = await blnQuery(`SELECT get_image_cluster_stack($1)`, [
      req.body.image_cluster_id,
    ]);
  } catch (err) {
    console.log(err);
  }
  console.log(response.rows[0].get_image_cluster_stack);
  res.status(200).json(response.rows[0].get_image_cluster_stack);
};

export const getCheapQuery = async (req, res) => {
  let response;
  try {
    // response = await blnQuery(`SELECT 10`, []);
    response = await blnQuery(`SELECT 1`);
    console.log(response);
  } catch (err) {
    console.log(err);
  }
  // res.status(200).json(response.rows[0]);
  res.status(200).json(response);
};
