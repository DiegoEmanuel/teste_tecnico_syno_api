import express from "express";
import cors from "cors";
import path from "path";
import userRoutes from "./modules/users/user.routes";
import productRoutes from "./modules/products/product.routes";



const app = express(); // importando o express para criar o servidor
app.use(cors()); //para que o servidor possa receber requisições de qualquer origem
app.use(express.json()); //para que o servidor possa receber requisições em formato json



const PORT = process.env.PORT || 3000; //para que o servidor possa receber requisições na porta 3000

app.use("/users", userRoutes);
app.use("/products", productRoutes);

// Permitir o acesso a imagens
app.use('/uploads/products', express.static(path.resolve(__dirname, '..', 'uploads', 'products')));


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
