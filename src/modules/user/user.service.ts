import { pool } from "../../config/db";

const createUserIntoDB = async (name: string, email: string, age: number) => {
  const result = await pool.query(
    `INSERT INTO users(name,email,age)VALUES($1,$2,$3)RETURNING*`,
    [name, email, age]
  );
  return result;
};
const getUsersFromDB = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result;
};
const getUserFromDB = async (id: number) => {
  const result = await pool.query(`SELECT * FROM users WHERE id=$1`, [id]);
  return result;
};
export const userService = { createUserIntoDB, getUsersFromDB, getUserFromDB };
