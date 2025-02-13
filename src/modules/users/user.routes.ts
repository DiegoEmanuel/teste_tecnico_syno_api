import { Router } from "express";
import { UserController } from "./user.controller";
import { AuthController } from "../auth/auth_controller";

const router = Router();
const userController = new UserController();
const authController = new AuthController();

router.post("/", userController.createUser.bind(userController));
router.get("/", userController.getAllUsers);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.delete("/", authController.verifyToken.bind(authController), userController.deleteAllUsers);

router.post("/login", authController.login.bind(authController));
router.get("/verify-token", authController.verifyToken.bind(authController), userController.getAllUsers);
export default router;
