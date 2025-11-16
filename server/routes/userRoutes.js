const express = require('express')
const router = express.Router()
const { authUser, registerUser, getUserProfile, getUsers } = require('../controllers/userController')

const { protect, admin } = require('../middleware/authMiddleware')

// POST to /api/users for registration
//router.route('/').post(registerUser)

// User Registration (Public) AND Admin: Get All Users (Private/Admin)
router.route('/').post(registerUser).get(protect, admin, getUsers) // <-- Chained Routes

// POST to /api/users/login for authentication
router.post('/login', authUser)

// User Profile (Private)
router.route('/profile').get(protect, getUserProfile)

module.exports = router