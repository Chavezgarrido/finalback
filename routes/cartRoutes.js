const express = require('express');
const cartController = require('../controllers/cartController'); 
const router = express.Router();

router.post('/carrito/:id/agregar', cartController.addToCart); 
router.delete('/carrito/:id/eliminar', cartController.removeFromCart); 
router.post('/carrito/:id/finalizar', cartController.finalizePurchase);

module.exports = router;