import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
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
    );`);
};

initDB();

// logger middleware
const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}\n`);
  next();
};

app.get("/", logger, (req: Request, res: Response) => {
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
      data: allUsers.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
// get single data
app.get("/user/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    // const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

    const user = await pool.query(`SELECT * FROM users WHERE id=$1`, [id]);
    if (user.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }

    res.status(200).json({
      message: "single user retrieve",
      success: true,
      data: user.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// update user
app.put("/user/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, age } = req.body;
    const updatedUser = await pool.query(
      `UPDATE users SET name=$1,email=$2,age=$3 WHERE id=$4 RETURNING*`,
      [name, email, age, id]
    );
    if (updatedUser.rows.length === 0) {
      res.status(500).json({
        success: false,
        message: "no user to update",
      });
    }
    res.status(200).json({
      success: true,
      data: updatedUser.rows[0],
      message: "single data  updated",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
// delete user
app.delete("/user/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const deletedUser = await pool.query(
      `DELETE FROM users WHERE id=$1 RETURNING *`,
      [id]
    );
    if (deletedUser.rowCount === 0) {
      res.status(500).json({
        success: false,
        message: "no user deleted",
      });
    }
    res.status(200).json({
      success: true,
      data: deletedUser.rows,
      message: "User Deleted Successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// todos CRUD
app.post("/todos", async (req: Request, res: Response) => {
  const { user_id, title } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO todos(user_id,title) VALUES($1,$2) RETURNING *`,
      [user_id, title]
    );
    res.status(201).json({
      success: true,
      message: "single todo created",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
app.get("/todos", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM todos`);
    res.status(200).json({
      success: true,
      message: "all todos retrieve",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
// get single todo
app.get("/todos/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await pool.query(`SELECT * FROM todos WHERE id=$1`, [id]);
    if (result.rows.length === 0) {
      res.status(500).json({
        success: false,
        message: "no todos to get",
      });
    }
    res.status(200).json({
      success: true,
      message: "single todo retrieve",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
// update /put
app.put("/todos/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title } = req.body;
  try {
    const result = await pool.query(
      //                 "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",

      `UPDATE todos SET title=$1 WHERE id=$2 RETURNING *`,
      [title, id]
    );
    if (result.rows.length === 0) {
      res.send("no todos updated");
    }
    res.status(500).json({
      success: true,
      message: "single data updated",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(200).json({
      success: true,
      message: "can't update todo",
      error: error.message,
    });
  }
});
// delete
app.delete("/todos/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const deleteUser = await pool.query(
      `DELETE FROM todos WHERE id=$1 RETURNING *`,
      [id]
    );
    if (deleteUser.rowCount === 0) {
      res.send("no user deleted");
    }
    res.status(200).json({
      success: true,
      message: "todo deleted",
      data: deleteUser.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "can't Delete todo",
      error: error.message,
    });
  }
});

// not found route(always place in the bottom  of the code)
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "route not found",
    path: req.path,
  });
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
