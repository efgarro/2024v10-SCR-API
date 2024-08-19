import Router from "express-promise-router";
import passport from "passport";
import dotenv from "dotenv";
import { getUsers } from "../RouteHandlers/apiHandlers.js";
import multer from "multer";
import multerS3 from "multer-s3";
import busboy from "busboy";
import ExifReader from "exifreader";

dotenv.config();

const bbBuffer = (req, res, next) => {
  const bb = busboy({ headers: req.headers });
  req.body = {};
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
  req.pipe(bb);
  next();
};

import {
  S3Client,
  ListBucketsCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://0cffae522cdd52172bbe596db41d0f8a.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

const storageR2 = multerS3({
  s3: s3,
  bucket: "scr-v2023a",
  acl: "public-read",
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    cb(null, Date.now().toString());
    // cb(null, file.originalname);
  },
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
    // cb(null, file.originalname);
  },
});
const storageMS = multer.memoryStorage();

const upload = multer({ storage: storage });
const uploadMS = multer({ storage: storageMS });
const uploadR2 = multer({ storage: storageR2 });

export const apiRouter = Router();

apiRouter.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  getUsers
);

apiRouter.post("/upload", bbBuffer, upload.single("file"), (req, res) => {
  // console.log(req.body.image_height);


  
  console.log(req.body);
  // console.log(req.file);
  res.send("Thanx");
});
