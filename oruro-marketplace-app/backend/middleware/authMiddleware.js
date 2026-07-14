const jwt = require('jsonwebtoken');
const fs = require('fs');

// Obtiene la clave secreta persistida en local
function getJwtSecret() {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }
  if (fs.existsSync('./jwt_secret.txt')) {
    return fs.readFileSync('./jwt_secret.txt', 'utf-8').trim();
  }
  throw new Error("Clave JWT no configurada");
}

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: "Acceso denegado. Cabecera de autorización no encontrada." });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: "Formato de token inválido." });
  }

  try {
    const verified = jwt.verify(token, getJwtSecret(), { algorithms: ['HS256'] }); // Forzar algoritmo HS256 seguro
    req.user = verified;
    next();
  } catch (err) {
    // Evitar volcar detalles del error del sistema de claves al cliente
    return res.status(403).json({ error: "Token de autorización inválido o expirado." });
  }
}

function isAdmin(req, res, next) {
  if (!req.user || req.user.tipoPerfil !== 'admin') {
    return res.status(403).json({ error: "Acceso denegado. Privilegios de administrador requeridos." });
  }
  next();
}

module.exports = { verifyToken, isAdmin };
