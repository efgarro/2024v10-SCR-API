import passport from "passport";
import fs from "fs";
import path from "path";

import * as db from "../Config/postgresPool.js";
import passportLocal from "passport-local";
import passportJWT from "passport-jwt";
import { validatePassword } from "../Utils/utils.js";

import * as url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = passportJWT.Strategy;
const { ExtractJwt } = passportJWT;

const pathToKey = path.join(__dirname, "..", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathToKey, "utf8");

const customFields = {
  usernameField: "email",
  password: "password",
};

const localVerifyCB = (email, password, done) => {
  db.query(
    `SELECT user_id, email, hash, salt FROM scr_users WHERE email = $1`,
    [email]
  )
    .then(({ rows }) => {
      const user = rows[0];
      if (!user) {
        return done(null, false);
      }

      const isValid = validatePassword(password, user.hash, user.salt);

      if (isValid) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
    .catch((err) => {
      console.log(`here${err}`);
      done(err);
    });
};

export const passportUseLocal = () =>
  passport.use(new LocalStrategy(customFields, localVerifyCB));

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ["RS256"],
};

const jwtVerifyCB = (payload, done) => {
  db.query(
    `SELECT user_id, email, hash, salt FROM scr_users WHERE user_id = $1`,
    [payload.sub]
  )
    .then(({ rows }) => {
      const user = rows[0];
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
    .catch((err) => done(err, null));
};

export const passportUseJWT = () =>
  passport.use(new JWTStrategy(jwtOptions, jwtVerifyCB));
