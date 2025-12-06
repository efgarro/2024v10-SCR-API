import { join } from "node:path";
import dotenv from "dotenv";

dotenv.config({
  path: join(import.meta.dirname, "../../.env"),
});

console.log(process.env.PG_USER);
console.log(process.env.PG_PWD);

import pg from "pg";
const { Pool } = pg;

const scrPool = new Pool({
  host: "54.205.165.107",
  port: 5432,
  database: "2024v10-scr-db",
  user: process.env.PG_USER,
  password: process.env.PG_PWD,
});

export const scrQuery = (text, params) => scrPool.query(text, params);

const blnPool = new Pool({
  host: "54.205.165.107",
  port: 5432,
  database: "2025v12-bln-db",
  user: "efgarro",
  password: "Due427ga",
});
// const blnPool = new Pool({
//   host: "54.205.165.107",
//   port: 5432,
//   database: "2025v12-bln-db",
//   user: process.env.PG_USER,
//   password: process.env.PG_PWD,
// });

export const blnQuery = (text, params) => blnPool.query(text, params);
