import * as db from "../Config/postgresPool.js";

import busboy from "busboy";
import { pipeline } from "node:stream";
import ExifReader from "exifreader";

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
  const { place_id, place_type, hub, name, description, latitude, longitude } =
    req.body;

  switch (place_type) {
    case "lodge":
      const { email } = req.body;
      try {
        await db.query(
          `INSERT INTO scr_places (place_id, schema_type, hub, name, description, latitude,  longitude) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [place_id, place_type, hub, name, description, latitude, longitude]
        );
        await db.query(
          `INSERT INTO scr_lodging (lodge_id, place_id, email) VALUES (uuid_generate_v7(), $1, $2)`,
          [place_id, email]
        );
      } catch (err) {
        console.log(err);
      }
      next();
  }
};
