import pg from "pg";
const { Pool } = pg;

// const pool = new Pool();

// const pgPoolPassword = process.env.PG_PWD;

const pool = new Pool({
      host: "localhost",
      port: 5432,
      database: "2024-v03-scr-db",
      user: "efgarro",
      password: "efgarro",
    })

export const query = (text, params) => pool.query(text, params);
