// import { join } from "node:path";
// import dotenv from "dotenv";

// dotenv.config({
//   path: join(import.meta.dirname, "../../.env"),
// });

// Use this code snippet in your app.
// If you need more information about configurations or implementing the sample code, visit the AWS docs:
// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started.html

import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

const secret_name = "Pg2024v10";

const client = new SecretsManagerClient({
  region: "us-east-1",
});

let response;

try {
  response = await client.send(
    new GetSecretValueCommand({
      SecretId: secret_name,
      VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
    })
  );
} catch (error) {
  // For a list of exceptions thrown, see
  // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
  throw error;
}

const secret = JSON.parse(response.SecretString);

// Your code goes here
console.log("secret");
console.log(secret);
console.log("User/Password");
console.log(secret.user);
console.log(secret.password);

import pg from "pg";
const { Pool } = pg;

const scrPool = new Pool({
  host: "54.205.165.107",
  port: 5432,
  database: "2024v10-scr-db",
  user: secret.user,
  password: secret.password,
});
// const scrPool = new Pool({
//   host: "54.205.165.107",
//   port: 5432,
//   database: "2024v10-scr-db",
//   user: process.env.PG_USER,
//   password: process.env.PG_PWD,
// });

export const scrQuery = (text, params) => scrPool.query(text, params);

const blnPool = new Pool({
  host: "54.205.165.107",
  port: 5432,
  database: "2025v12-bln-db",
  user: secret.user,
  password: secret.password,
});
// const blnPool = new Pool({
//   host: "54.205.165.107",
//   port: 5432,
//   database: "2025v12-bln-db",
//   user: process.env.PG_USER,
//   password: process.env.PG_PWD,
// });

// bln

export const blnQuery = (text, params) => blnPool.query(text, params);
