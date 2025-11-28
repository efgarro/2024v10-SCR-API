import { scrQuery } from "../Config/postgresPool.js";

import multer from "multer";
import { storageR2 } from "../Config/multer.js";

export const uploadImageToR2 = multer({ storage: storageR2("scr-v2023a") });

export const insertImageIntoDB = async (req, res) => {
  const { image_id, image_set_id, orientation } = req.body;
  const { key } = req.file;
  const url = `https://r2storage.soy-cr.com/${key}`;
  try {
    const response = await scrQuery(
      `SELECT insert_image_into_db($1, $2, $3, $4, $5)`,
      [image_id, image_set_id, key, url, orientation]
    );
    console.log(response);
  } catch (err) {
    console.log(err);
  }
  res.json({ ...req.body, ...req.file, url: url });
};

export const getImageSetStack = async (req, res) => {
  console.log(req.body.image_set_id);
  let response;
  try {
    response = await scrQuery(`SELECT get_image_set_stack($1)`, [
      req.body.image_set_id,
    ]);
  } catch (err) {
    console.log(err);
  }
  res.status(200).json(response.rows[0].get_image_set_stack);
};

export const updateImageSetStack = async (req, res, next) => {
  try {
    await scrQuery(
      `UPDATE scr_image_sets SET image_set_stack = ($2) WHERE image_set_id = ($1)`,
      [req.body.image_set_id, req.body.stack_uuids]
    );
  } catch (error) {
    console.log(error);
  }
  res.send("Hello update");
};

export const registerPlace = async (req, res, next) => {
  const { place_type, hub, name, description, is_live, latitude, longitude } =
    req.body;

  switch (place_type) {
    case "lodge":
      try {
        const record = await scrQuery(
          `SELECT register_lodge($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            place_type,
            hub,
            name,
            description,
            is_live,
            latitude,
            longitude,
            req.body.email,
          ]
        );
        res.send(record.rows[0].register_lodge[0]);
      } catch (err) {
        console.log(err);
      }
      break;
    case "resta":
      try {
        await scrQuery(
          `SELECT register_resta($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            place_type,
            hub,
            name,
            description,
            is_live,
            latitude,
            longitude,
            req.body.email,
          ]
        );
      } catch (err) {
        console.log(err);
      }
      break;
    default:
      console.log("place_type do not match");
  }
  next();
};

export const selectPlaceToAddImages = async (req, res) => {
  let response;
  try {
    response = await scrQuery(
      `SELECT * FROM scr_places WHERE is_live = 'false'`
    );
  } catch (err) {
    console.log(err);
  }
  res.status(200).json(response.rows);
};
