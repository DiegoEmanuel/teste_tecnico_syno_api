import express from "express";
import { setupRoutes } from "./routes";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

setupRoutes(app);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});

