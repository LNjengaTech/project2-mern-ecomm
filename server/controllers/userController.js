const asyncHandler = require('express-async-handler')
const generateToken = require('../utils/generateToken')
const User = require('../models/User')

// @desc    Auth user & get token (Login)
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body //extract email and password from the request body

  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    // Successful Login
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id), // Send the JWT token
    })
  } else {
    res.status(401) // Unauthorized
    throw new Error('Invalid email or password')
  }
})

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400) // Bad Request
    throw new Error('User already exists')
  }

  const user = await User.create({
    name,
    email,
    password, // The pre-save hook in User.js handles hashing this password
  })

  if (user) {
    res.status(201).json({ // 201: Resource created
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})


// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private (requires token)
const getUserProfile = asyncHandler(async (req, res) => {
  // req.user is available because of the 'protect' middleware
  const user = await User.findById(req.user._id)

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).sort({ isAdmin: -1, createdAt: -1 }) // Admins first, then newest users
  res.json(users)
})


// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    // Optional safety check: prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
        res.status(400)
        throw new Error('Cannot delete yourself.')
    }
    
    await user.deleteOne() 
    res.json({ message: 'User removed' })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  // Select everything except the password field for security
  const user = await User.findById(req.params.id).select('-password')

  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  // 1. Find the user to update
  const user = await User.findById(req.params.id)

  if (user) {
    // 2. Update fields, using existing values as fallbacks
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    
    // Convert the boolean string/value to the correct boolean type
    user.isAdmin = req.body.isAdmin
    
    // 3. Save the updated user to the database
    const updatedUser = await user.save()

    // 4. Return the updated user data (without the password)
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

module.exports = { authUser, registerUser, getUserProfile, getUsers, deleteUser, getUserById, updateUser}