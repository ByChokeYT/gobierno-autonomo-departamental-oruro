// Controlador de Productos (Catálogo y CRUD del Productor)
// Implementar consultas con Prisma Client

const getProducts = async (req, res, next) => {
  try {
    // TODO: Recuperar filtros desde req.query (search, category, municipio, sort)
    // TODO: Consultar base de datos con prisma.producto.findMany aplicando filtros
    res.status(501).json({ mensaje: "Consulta de productos pendiente de implementación" });
  } catch (err) {
    next(err);
  }
};

const getProductById = async (req, res, next) => {
  try {
    // TODO: Consultar producto por id con prisma.producto.findUnique
    res.status(501).json({ mensaje: "Consulta detallada pendiente de implementación" });
  } catch (err) {
    next(err);
  }
};

const createProduct = async (req, res, next) => {
  try {
    // TODO: Validar que el usuario sea de tipoPerfil === 'productor'
    // TODO: Insertar producto usando prisma.producto.create mapeando el usuarioId desde req.user
    res.status(501).json({ mensaje: "Publicación de producto pendiente de implementación" });
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    // TODO: Validar que el producto pertenezca al usuario autenticado (propiedad)
    // TODO: Actualizar usando prisma.producto.update
    res.status(501).json({ mensaje: "Edición de producto pendiente de implementación" });
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    // TODO: Validar propiedad del producto o perfil de administrador
    // TODO: Ejecutar prisma.producto.delete
    res.status(501).json({ mensaje: "Eliminación de producto pendiente de implementación" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
