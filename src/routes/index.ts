import { Express } from 'express';
import userRoutes from "../modules/users/user.routes";
import productRoutes from "../modules/products/product.routes";
import cors from "cors";

export function setupRoutes(app: Express) {
    // Configuração do CORS
    app.use(cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // Rotas da API
    app.use("/users", userRoutes);
    app.use("/products", productRoutes);
} 