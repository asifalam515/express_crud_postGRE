import { Router } from "express";
import auth from "../../middleware/auth";
import { userControllers } from "./user.controller";
const router = Router();

router.post("/", userControllers.createUser);
router.get("/", auth("admin"), userControllers.getUsers);
router.get("/:id", auth("admin", "user"), userControllers.getUser);
router.put("/:id", userControllers.updateUser);
router.delete("/:id", userControllers.deleteUser);
export const userRoutes = router;
