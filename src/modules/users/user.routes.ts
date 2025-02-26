import { Router } from "express";
import { UserController } from "./user.controller";
import { AuthController } from "../auth/auth.controller";

const router = Router();
const userController = new UserController();
const authController = new AuthController();

router.post("/", userController.createUser.bind(userController));
router.get("/", authController.verifyToken.bind(authController), userController.getAllUsers.bind(userController));
router.put("/:id",  authController.verifyToken.bind(authController),userController.updateUser.bind(userController));
router.delete("/:id", authController.verifyToken.bind(authController),userController.deleteUser.bind(userController));
router.delete("/", authController.verifyToken.bind(authController), userController.deleteAllUsers.bind(userController));

router.post("/login", authController.login.bind(authController));
router.get("/verify-token", authController.verifyToken.bind(authController), userController.getAllUsers.bind(userController));
export default router;
