import { Request, Response, Router } from "express";
import { pool } from "../../config/db";
import { userControllers } from "./user.controller";
const router = Router();

router.post("/", userControllers.createUser);
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
