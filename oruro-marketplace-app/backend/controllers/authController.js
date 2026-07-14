// Controlador de Autenticación
// Implementar lógica de base de datos usando Prisma Client

const register = async (req, res, next) => {
  try {
    // TODO: Validar entradas del request
    // TODO: Insertar usuario con prisma.usuario.create
    // TODO: Generar y firmar JWT usando jwt.sign
    res.status(501).json({ mensaje: "Registro pendiente de implementación" });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    // TODO: Validar que el telefonoWhatsapp exista
    // TODO: Generar JWT token
    res.status(501).json({ mensaje: "Login pendiente de implementación" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login
};
