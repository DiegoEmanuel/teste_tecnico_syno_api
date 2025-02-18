import { Router } from "express";
import { ProductController } from "./product.controller";
import { AuthController } from "../auth/auth_controller";
import upload from "../../config/multerconfig";
import uploadImage from "../../services/firebase";

const router = Router();
const productController = new ProductController();
const authController = new AuthController();

router.post("/",
    authController.verifyToken.bind(authController),
    upload.single("foto_produto"),
    uploadImage,
    productController.createProduct.bind(productController)
);

router.get("/", productController.getAllProducts.bind(productController));

router.put("/:id", 
    authController.verifyToken.bind(authController), 
    upload.single("foto_produto"),
    uploadImage,
    productController.updateProduct.bind(productController)
);

router.delete("/:id", authController.verifyToken.bind(authController), productController.deleteProduct.bind(productController));

router.get("/:id", productController.getProductById.bind(productController));

router.delete("/", authController.verifyToken.bind(authController), productController.deleteAllProducts.bind(productController));

export default router;


