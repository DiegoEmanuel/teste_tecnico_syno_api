import { Router } from "express";
import { ProductController } from "./product.controller";


const router = Router();
const productController = new ProductController();

router.post("/", productController.createProduct.bind(productController));
router.get("/", productController.getAllProducts);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

export default router;
