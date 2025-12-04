import { Router } from "express";
import { userControllers } from "./user.controller";
const router = Router();

router.post("/", userControllers.createUser);
router.get("/", userControllers.getUsers);
router.get("/:id", userControllers.getUser);
router.put("/:id", userControllers.updateUser);
router.delete("/:id", userControllers.deleteUser);
export const userRoutes = router;
