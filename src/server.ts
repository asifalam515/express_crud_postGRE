import dotenv from "dotenv";
import express, { Request, Response } from "express";
import path from "path";
import { Pool } from "pg";
const app = express();
const port = 5000;

dotenv.config({ path: path.join(process.cwd(), ".env") });
// parser
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// db=>database
const pool = new Pool({
  connectionString: `${process.env.CONNECTION_STRING}`,
});
const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      age INT,
      phone VARCHAR(15),
      address TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);
  await pool.query(`CREATE TABLE IF NOT EXISTS todos(
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT false,
    due_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()    
    )`);
};

initDB();
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});
app.post("/users", async (req: Request, res: Response) => {
  const { name, email, age } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO users(name,email,age)VALUES($1,$2,$3)RETURNING*`,
      [name, email, age]
    );
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
// get all data
app.get("/users", async (req: Request, res: Response) => {
  try {
    const allUsers = await pool.query(`SELECT * FROM users`);
    res.status(200).json({
      success: true,
      data: allUsers,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
