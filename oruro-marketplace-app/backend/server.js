const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

require('dotenv').config();

const app = express();
const prisma = new PrismaClient();

// Resolución segura de clave secreta para JWT
// De acuerdo a las políticas de seguridad corporativas (evitar fallbacks de texto plano fijos)
function getJwtSecret() {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }
  if (fs.existsSync('./jwt_secret.txt')) {
    return fs.readFileSync('./jwt_secret.txt', 'utf-8').trim();
  }
  console.warn("⚠️ ALERTA DE SEGURIDAD: JWT_SECRET no configurada. Generando clave efímera aislada de la instancia.");
  const ephemeralSecret = crypto.randomBytes(32).toString('hex');
  try {
    fs.writeFileSync('./jwt_secret.txt', ephemeralSecret);
  } catch (err) {
    console.error("No se pudo escribir el archivo jwt_secret.txt", err);
  }
  return ephemeralSecret;
}

const JWT_SECRET = getJwtSecret();

// Middlewares de Seguridad y CORS
app.use(express.json());

// CORS restrictivo para evitar comodines inseguros
const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Bloqueado por políticas CORS de la Gobernación'));
    }
  },
  credentials: true
}));

// Inyección manual de Cabeceras de Seguridad (Mitigación de Clickjacking, XSS y Sniffing)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Content-Security-Policy', "default-src 'self'; frame-ancestors 'none';");
  next();
});

// Ruta Base de Verificación
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: "online",
    timestamp: new Date(),
    entorno: process.env.NODE_ENV || "development"
  });
});

// Importar rutas de módulos
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const analyticRoutes = require('./routes/analyticRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', analyticRoutes);

// Manejo centralizado de errores (Evitando fugas de trazas internas a usuarios)
app.use((err, req, res, next) => {
  console.error(`[Error de Sistema]: ${err.message}`, err.stack);
  res.status(err.status || 500).json({
    error: "Ocurrió un error interno en el servidor de la Gobernación.",
    detalles: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Lanzamiento del Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`🔌 Conexión a Prisma Client inicializada`);
});

module.exports = { app, prisma, JWT_SECRET };
