import { Router } from "express";
import { ProductController } from "./product.controller";
import { AuthController } from "../auth/auth_controller";

const router = Router();
const productController = new ProductController();
const authController = new AuthController();

router.post("/", authController.verifyToken.bind(authController), productController.createProduct.bind(productController));
router.get("/", authController.verifyToken.bind(authController), productController.getAllProducts);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);
router.get("/:id", productController.getProductById);

export default router;
