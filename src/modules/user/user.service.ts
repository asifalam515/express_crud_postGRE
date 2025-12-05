import bcrypt from "bcryptjs";
import { pool } from "../../config/db";

const createUserIntoDB = async (payload: Record<string, unknown>) => {
  const { name, email, password, role } = payload;
  const hashedPassword = await bcrypt.hash(password as string, 10);
  const result = await pool.query(
    `INSERT INTO users(name,email,password,role)VALUES($1,$2,$3,$4)RETURNING name,email`,
    [name, email, hashedPassword, role]
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
const updateUserToDB = async (
  name: string,
  email: string,
  age: number,
  id: any
) => {
  const result = await pool.query(
    `UPDATE users SET name=$1,email=$2,age=$3 WHERE id=$4 RETURNING*`,
    [name, email, age, id]
  );
  return result;
};
const deleteUserFromDB = async (id: any) => {
  const result = await pool.query(`DELETE FROM users WHERE id=$1 RETURNING *`, [
    id,
  ]);
  return result;
};
export const userService = {
  createUserIntoDB,
  getUsersFromDB,
  getUserFromDB,
  updateUserToDB,
  deleteUserFromDB,
};
