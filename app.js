// /auth-service/app.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import config from './config/config.js';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import errorHandler from './middleware/errorMiddleware.js';

const app = express();

// Configuración de la base de datos
await connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas de autenticación
app.use('/auth', authRoutes);

// Middleware para manejar errores
app.use(errorHandler);

// Puerto de escucha
const PORT = config.port;
app.listen(PORT, () => {
    console.log(`Servidor de autenticación escuchando en el puerto ${PORT}`);
});
