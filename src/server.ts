import express from "express";
import cors from "cors";
import path from "path";
import userRoutes from "./modules/users/user.routes";
import productRoutes from "./modules/products/product.routes";

const app = express();

// Configuração mais permissiva do CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use("/users", userRoutes);
app.use("/products", productRoutes);

// Configurar CORS específico para a rota de imagens
app.use('/uploads/products', cors(), express.static(path.resolve(__dirname, '..', 'uploads', 'products')));

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});
