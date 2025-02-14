import { Router } from "express";
import { ProductController } from "./product.controller";
import { AuthController } from "../auth/auth_controller";

const router = Router();
const productController = new ProductController();
const authController = new AuthController();

router.post("/", authController.verifyToken.bind(authController), productController.createProduct.bind(productController));
router.get("/", authController.verifyToken.bind(authController), productController.getAllProducts.bind(productController));
router.put("/:id", productController.updateProduct.bind(productController));
router.delete("/:id", productController.deleteProduct.bind(productController));
router.get("/:id", productController.getProductById.bind(productController));

export default router;
