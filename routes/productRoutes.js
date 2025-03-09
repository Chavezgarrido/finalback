const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/:id', productController.getProductById);

router.get('/categoria/:categoria', productController.getProductsByCategory);

module.exports = router;
