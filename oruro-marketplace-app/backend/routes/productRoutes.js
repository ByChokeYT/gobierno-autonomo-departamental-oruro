const express = require('express');
const router = express.Router();
// const productController = require('../controllers/productController');
// const { verifyToken } = require('../middleware/authMiddleware');

// Rutas públicas del catálogo
// router.get('/', productController.getProducts);
// router.get('/:id', productController.getProductById);

// Rutas privadas del productor (Requieren token JWT)
// router.post('/', verifyToken, productController.createProduct);
// router.put('/:id', verifyToken, productController.updateProduct);
// router.delete('/:id', verifyToken, productController.deleteProduct);

module.exports = router;
