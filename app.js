// /auth-service/app.js
import 'dotenv/config';
import express from 'express';
import config from './config/config.js';
import {connectDB} from './config/db.js'; 
import authRoutes from './routes/authRoutes.js';



const app = express();

// Configuración de la base de datos
// /auth-service/app.js
await connectDB();
  


// Middleware para parsear el cuerpo de las solicitudes
app.use(express.json());

// Rutas de autenticación
app.use('/auth', authRoutes);

// Puerto de escucha
const PORT = config.port;
app.listen(PORT, () => {
    console.log(`Servidor de autenticación escuchando en el puerto ${PORT}`);
});
