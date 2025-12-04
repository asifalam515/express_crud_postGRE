import { Request, Response, Router } from "express";
import { pool } from "../../config/db";
const router = Router();

router.post("/", async (req: Request, res: Response) => {
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
router.get("/", async (req: Request, res: Response) => {
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
export const userRoutes = router;
