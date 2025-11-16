const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/User')

const protect = asyncHandler(async (req, res, next) => {
  let token

  // Check for 'Bearer' token in the 'Authorization' header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (format is 'Bearer TOKEN')
      token = req.headers.authorization.split(' ')[1]

      // Verify token using JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Find user by ID from the decoded token payload and exclude the password
      req.user = await User.findById(decoded.id).select('-password')

      next() // Move on to the actual route controller
    } catch (error) {
      console.error(error)
      res.status(401) // Not Authorized
      throw new Error('Not authorized, token failed')
    }
  }

  if (!token) {
    res.status(401) // Not Authorized
    throw new Error('Not authorized, no token')
  }
})

// Middleware to restrict access to only Admin users (Phase 2.2.4)
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next() // User is logged in and is an Admin, proceed
  } else {
    res.status(401)
    throw new Error('Not authorized as an admin')
  }
}

module.exports = { protect, admin }