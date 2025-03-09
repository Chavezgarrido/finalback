const express = require('express');
const categoryController = require('../controllers/categoryController');
const router = express.Router();

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.get('/categoria/productos/:categoria', productController.getProductsByCategory); 


module.exports = router;
