import pg from "pg";
const { Pool } = pg;

// const pool = new Pool();

// const pgPoolPassword = process.env.PG_PWD;

const pool = new Pool({
      host: "54.205.165.107",
      port: 5432,
      database: "2024v10-scr-db",
      user: "efgarro",
      password: "Due427ga",
    })

export const query = (text, params) => pool.query(text, params);
