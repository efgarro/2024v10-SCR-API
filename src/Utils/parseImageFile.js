import busboy from "busboy";
import { pipeline } from "node:stream";
import ExifReader from "exifreader";

export const parseImageFile = (req, res, next) => {
  const bb = busboy({ headers: req.headers });
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