const mongoose = require('mongoose')

// 1. Define the Review Schema (nested in Product Schema)
const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    // Link the review to the user who wrote it
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
)

// 2. Define the Main Product Schema
const productSchema = mongoose.Schema(
  {
    // Link the product to the admin user who created it
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String, // Path/URL to the main product image
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String, // e.g., 'Phones', 'TVs', 'Smartwatches'
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    // Specifications for the Comparison Tool
    specs: {
      processor: { type: String },
      ram: { type: String },
      screenSize: { type: String },
      battery: { type: String },
    },
    reviews: [reviewSchema], // Array of review objects
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },

    // 🔑 NEW FIELD: Flag for Featured Products
    isFeatured: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

const Product = mongoose.model('Product', productSchema)

module.exports = Product