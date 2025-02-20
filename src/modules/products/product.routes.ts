import { Router } from "express";
import { ProductController } from "./product.controller";

import { validateBody } from "../../middlewares/validationMiddleware";
import { ProductDTO } from "./dtos/product.dto";
import upload from "../../config/multerconfig";
import { uploadImageToServer } from "../../services/handleLocalServerImage";
import { AuthController } from "../auth/auth.controller";
const router = Router();
const productController = new ProductController();
const authController = new AuthController();

router.post(
  "/",
  authController.verifyToken.bind(authController),
  upload.single("foto_produto"),
  uploadImageToServer,
  validateBody(ProductDTO),
  productController.createProduct.bind(productController)
);

router.get("/", productController.getAllProducts.bind(productController), );

router.put(
  "/:id",
  upload.single("foto_produto"),
  uploadImageToServer,
  validateBody(ProductDTO),
  authController.verifyToken.bind(authController),
  productController.updateProduct.bind(productController)
);

router.delete("/:id", authController.verifyToken.bind(authController), productController.deleteProduct.bind(productController));

router.get("/:id", productController.getProductById.bind(productController));

router.delete("/", authController.verifyToken.bind(authController), productController.deleteAllProducts.bind(productController));

router.delete("/:id/image", authController.verifyToken.bind(authController), productController.deleteProductImage.bind(productController));

export default router;


