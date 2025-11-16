//Helper function for generating tokens for both registration and login

const jwt = require('jsonwebtoken')

const generateToken = (id) => {
  // Uses the secret key defined in your .env file
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  })
}

module.exports = generateToken