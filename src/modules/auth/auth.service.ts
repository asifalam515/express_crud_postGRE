import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";
import { pool } from "../../config/db";

const loginUserToDB = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email=$1 `, [
    email,
  ]);
  if (result.rows.length === 0) {
    return null;
  }
  const user = result.rows[0];
  const isMatched = await bcrypt.compare(password, user.password);
  if (!isMatched) {
    return false;
  }

  const token = jwt.sign(
    { name: user.name, email: user.email },
    config.jwtSecret as string,
    {
      expiresIn: "7d",
    }
  );
  console.log(token);
  return { token, user };
};
export const authService = { loginUserToDB };
