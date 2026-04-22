const express = require('express');
const router = express.Router();
const { 
    getOrders, 
    getOrderById, 
    createOrder, 
    updateOrder, 
    deleteOrder 
} = require('../controllers/ordersController');

router.get('/', getOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.patch('/:id', updateOrder);
router.delete('/:id', deleteOrder);

module.exports = router;