import * as db from "../Config/postgresPool.js";

// const getUsers = (req, res) => {
//     pgClient
//       .query(`SELECT * FROM scr_users LIMIT $1`, [limit])
//       .then(({ rows }) => {
//         res.json(rows);
//       })
//       .catch((err) => res.json({ success: false, msg: err }));
//   };
  export const getUsers = async (req, res) => {
    const value = await db.query(`SELECT * FROM scr_users`);
    res.send(value.rows);
  }