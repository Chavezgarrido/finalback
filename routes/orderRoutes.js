const express = require('express');
const orderController = require('../controllers/orderController');
const router = express.Router();

router.get('/usuarios/:id/pedidos', orderController.getOrdersByUserId); 
router.get('/usuarios/:id/pedidos/:pedido_id', orderController.getOrderById); 

module.exports = router;