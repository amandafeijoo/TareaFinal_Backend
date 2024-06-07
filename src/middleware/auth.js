require('dotenv').config();
const jwt = require('jsonwebtoken');

// Middleware de autenticación
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send('Acceso denegado. No se proporcionó ningún token.');
    }
  
    const token = authHeader.split(' ')[1];
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (ex) {
      return res.status(400).send('Token inválido.');
    }
  }

// Middleware de autorización
function authorizeAdmin(req, res, next) {
  if (!req.user.isAdmin) {
    return res.status(403).send('Acceso denegado.');
  }

  next();
}

module.exports = {
  authenticate,
  authorizeAdmin
};