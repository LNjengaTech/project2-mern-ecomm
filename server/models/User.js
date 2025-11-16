const mongoose = require('mongoose')
const bcrypt = require('bcryptjs') // Used for password hashing

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Crucial: ensures no two users share an email
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false, // Default user is a regular customer
    },
  },
  {
    timestamps: true, // Automatically adds 'createdAt' and 'updatedAt' fields
  }
)

// 🔑 Pre-save Middleware: Encrypt password before saving
userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10) // Generates a salt (random value)
  this.password = await bcrypt.hash(this.password, salt) // Hashes password using the salt
})

// 🔑 Method to compare entered password with hashed password during login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model('User', userSchema)

module.exports = User