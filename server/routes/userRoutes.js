const express = require('express')
const router = express.Router()
const { authUser, registerUser, getUserProfile, getUsers, deleteUser, getUserById, updateUser } = require('../controllers/userController')

const { protect, admin } = require('../middleware/authMiddleware')

// Route 1: /api/users
router.route('/')
    .post(registerUser)         // POST: Register User (Public)
    .get(protect, admin, getUsers) // GET: Get All Users (Private/Admin)

// Route 2: /api/users/login
router.post('/login', authUser)

// Route 3: /api/users/profile
router.route('/profile')
    .get(protect, getUserProfile) // GET: User Profile (Private)

// Route 4: /api/users/:id
// This single route handles GET (fetch), DELETE (remove), and PUT (update) for a single user ID
router.route('/:id')
    .delete(protect, admin, deleteUser)  // DELETE: Delete User (Private/Admin)
    .get(protect, admin, getUserById)   // GET: Get User by ID (Private/Admin)
    .put(protect, admin, updateUser)    // PUT: Update User (Private/Admin)
    
module.exports = router