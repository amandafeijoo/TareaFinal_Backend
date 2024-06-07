const express = require('express');
const connectDB = require('./database/connect');
const router = require('./routes');
require('dotenv').config();

// tus otros require y el resto de tu código van aquí

const app = express();

// Conectar a la base de datos
connectDB();

// Middleware para parsear el cuerpo de las solicitudes
app.use(express.json());

// Usar las rutas
app.use(router);

// Iniciar el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});