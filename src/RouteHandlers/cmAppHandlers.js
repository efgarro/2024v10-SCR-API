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
        console.log(record.rows[0].register_lodge[0]);
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
