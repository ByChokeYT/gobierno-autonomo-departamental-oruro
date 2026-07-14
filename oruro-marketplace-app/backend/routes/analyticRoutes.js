const express = require('express');
const router = express.Router();
// const analyticController = require('../controllers/analyticController');
// const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Registro de clicks/interacciones de contacto
// router.post('/interactions', analyticController.recordInteraction);

// Panel de control exclusivo Gobernación (Requiere Auth + Admin)
// router.get('/analytics', verifyToken, isAdmin, analyticController.getSystemAnalytics);
// router.put('/products/:id/moderate', verifyToken, isAdmin, analyticController.moderateProduct);

module.exports = router;
