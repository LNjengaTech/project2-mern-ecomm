// /backend/routes/dashboardRoutes.js
const express = require('express')
const { protect, admin } = require('../middleware/authMiddleware.js')
const { getDashboardData } =  require('../controllers/dashboardController.js')

const router = express.Router()

// GET /api/dashboard - Private/Admin access only
router.route('/').get(protect, admin, getDashboardData)

module.exports = router