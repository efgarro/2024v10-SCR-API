import * as db from "../Config/postgresPool.js";

import busboy from "busboy";
import { pipeline } from "node:stream";
import ExifReader from "exifreader";
import { v7 as uuidv7 } from "uuid";

import multer from "multer";
import { storageR2 } from "../Config/multer.js";

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
      req.body.image_height = tags[`Image Height`].value;
      // console.log(tags[`Image Height`]);
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

export const uploadToR2 = multer({ storage: storageR2 });

export const registerNewPlace = async (req, res, next) => {
  const { place_type, hub, name, description, latitude, longitude } = req.body;
  const place_id = uuidv7();
  const image_set_id = uuidv7();

  switch (place_type) {
    case "lodge":
      const lodge_id = uuidv7();
      try {
        await db.query(`SELECT register_lodge($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`, [
          place_id,
          lodge_id,
          image_set_id,
          place_type,
          hub,
          name,
          description,
          latitude,
          longitude,
          req.body.email
        ]);
      } catch (err) {
        console.log(err);
      }
      next();
    case "resta":
      const resta_id = uuidv7();
      try {
        await db.query(`SELECT register_resta($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`, [
          place_id,
          resta_id,
          image_set_id,
          place_type,
          hub,
          name,
          description,
          latitude,
          longitude,
          req.body.email
        ]);
      } catch (err) {
        console.log(err);
      }
      next();
  }
};
