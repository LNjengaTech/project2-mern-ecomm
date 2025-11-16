const express = require('express')
const router = express.Router()
const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToDelivered
} = require('../controllers/orderController')
const { protect, admin } = require('../middleware/authMiddleware')

// Admin: Get all orders (GET) | User: Create new order (POST)
router.route('/')
  .post(protect, addOrderItems)
  .get(protect, admin, getOrders)

// Get user's order history
router.route('/myorders').get(protect, getMyOrders)

// Get specific order details
router.route('/:id').get(protect, getOrderById)

// Mark order as paid
router.route('/:id/pay').put(protect, updateOrderToPaid)

// Admin: Mark order as delivered
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered)

module.exports = router