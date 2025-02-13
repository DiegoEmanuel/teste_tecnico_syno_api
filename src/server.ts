import express from "express";
import cors from "cors";
import userRoutes from "./modules/users/user.routes";
import productRoutes from "./modules/products/product.routes";


const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.use("/users", userRoutes);
app.use("/products", productRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
