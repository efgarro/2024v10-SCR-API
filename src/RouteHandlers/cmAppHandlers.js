import * as db from "../Config/postgresPool.js";

import busboy from "busboy";
import { pipeline } from "node:stream";
import ExifReader from "exifreader";
import { v7 as uuidv7 } from "uuid";

import multer from "multer";
import { storageR2, storageDS } from "../Config/multer.js";

export const parseImageFile = (req, res, next) => {
  const bb = busboy({ headers: req.headers });
  // req.body = {};
  const chunks = [];
  bb.on("file", (name, file, info) => {
    file.on("data", (chunk) => {
      chunks.push(chunk);
    });
    file.on("end", () => {
      const fileBuffer = Buffer.concat(chunks);
      const tags = ExifReader.load(fileBuffer);
      const height = tags[`Image Height`].value;
      const width = tags[`Image Width`].value;
      if (width >= height) {
        req.body.orientation = "lan";
      } else if (height > width) {
        req.body.orientation = "por";
      }
      req.body.image_height = height;
      req.body.image_width = width;
    });
  });
  bb.on("close", () => {
    return req;
  });

  pipeline(req, bb, (err) => {
    if (err) {
      console.error("Pipeline failed.", err);
    } else {
      console.log("Pipeline succeeded.");
    }
  }),
    next();
};

export const uploadImageToR2 = multer({ storage: storageR2 });

export const insertImageIntoDB = async (req, res, next) => {
  const { image_id, image_tag, image_set_id, orientation } = req.body;
  const { key } = req.file;
  const url = `https://r2storage.soy-cr.com/${key}`;
  try {
    const response = await db.query(
      `SELECT insert_image_into_db($1, $2, $3, $4, $5)`,
      [image_id, image_set_id, key, url, orientation]
    );
    console.log(response);
  } catch (err) {
    console.log(err);
  }
  res.json({ ...req.body, ...req.file, url: url });
  // next();
};

export const getImageSetStack = async (req, res, next) => {
  console.log(req.body.image_set_id);
  const response = await db.query(`SELECT get_image_set_stack($1)`, [
    req.body.image_set_id,
  ]);
  console.log("response.rows[0].get_image_set_stack");
  console.log(response.rows[0].get_image_set_stack);
  res.status(200).json(response.rows[0].get_image_set_stack);
  // res.json("response.rows[0].image_set_stack");
};
export const updateImageSetStack = async (req, res, next) => {
  console.log("req.body");
  console.log(req.body);
  try {
    await db.query(
      `UPDATE scr_image_sets SET image_set_stack = ($2) WHERE image_set_id = ($1)`,
      [req.body.image_set_id, req.body.stack_uuids]
    );
  } catch (error) {
    console.log(error);
  }

  res.send("Hello update");
};

export const registerPlace = async (req, res, next) => {
  const { place_type, hub, name, description, latitude, longitude } = req.body;

  switch (place_type) {
    case "lodge":
      try {
        const record = await db.query(
          `SELECT register_lodge($1, $2, $3, $4, $5, $6, $7)`,
          [
            place_type,
            hub,
            name,
            description,
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
        await db.query(`SELECT register_resta($1, $2, $3, $4, $5, $6, $7)`, [
          place_type,
          hub,
          name,
          description,
          latitude,
          longitude,
          req.body.email,
        ]);
      } catch (err) {
        console.log(err);
      }
      break;
    default:
      console.log("place_type do not match");
  }
  next();
};
