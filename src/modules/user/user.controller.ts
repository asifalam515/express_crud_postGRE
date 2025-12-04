import { Request, Response } from "express";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  const { name, email, age } = req.body;
  try {
    const result = await userService.createUserIntoDB(name, email, age);
    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
const getUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await userService.getUsersFromDB();
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
};
const getUser = async (req: Request, res: Response) => {
  const id: any = req.params.id;
  try {
    // const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

    const user = await userService.getUserFromDB(id);
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
};
export const userControllers = { createUser, getUsers, getUser };
