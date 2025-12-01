const mongoose = require('mongoose')

const orderSchema = mongoose.Schema(
  {
    // Link to the user who placed the order
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // Array of items purchased
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        // Link to the specific product document
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
      },
    ],
    shippingAddress: {
      phone: { type: String, required: true }, // 🔑 NEW
      address: { type: String, required: true },
      postalCode: { type: String, required: true },
      county: { type: String, required: true },
      town: { type: String, required: true }, // 🔑 NEW
      
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    // Details received from the payment gateway (e.g., Stripe or PayPal)
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    // Status tracking fields
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // Auto-add createdAt and updatedAt
  }
)

const Order = mongoose.model('Order', orderSchema)

module.exports = Order