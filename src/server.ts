import express from "express";
import { setupRoutes } from "./routes";
import path from "path";

const app = express();
app.use(express.json());

// Configurar CORS se necessário
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Configurar pasta uploads como estática
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const PORT = process.env.PORT || 3000;

setupRoutes(app);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});

