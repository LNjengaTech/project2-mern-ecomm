// /server/controllers/orderController.js

const asyncHandler = require('express-async-handler')
const Order = require('../models/Order')
const Product = require('../models/Product') // Needed to update stock

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {                                              //extract these data from the request body
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body

  if (orderItems && orderItems.length === 0) {
    res.status(400)
    throw new Error('No order items')
  } else {
    const order = new Order({     // create a new instance of the Order mongoose model in the memory
      user: req.user._id,         //retrieve logged in user id
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: paymentMethod === 'Payment on Delivery' ? false : false, // Orders with 'Payment on Delivery' are marked as unpaid initially

      // 🔑 Add a field to track POD status specifically if needed, 
        // but paymentMethod handles it well enough for now.
    })

    const createdOrder = await order.save()
    res.status(201).json(createdOrder)  //respont with the 201 status and send back the saved order document back to client as a JSON response

    // 💡 ADVANCED LOGIC: Decrement stock count for each item purchased
    for (const item of orderItems) {
        const product = await Product.findById(item.product)
        if (product) {
            product.countInStock -= item.qty
            await product.save()
        }
    }
  }
})

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  // populate('user', 'name email') pulls the user's name and email into the order object
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  )

  if (order) {
    // Must ensure the user asking is the user who placed the order OR an admin
    if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
         res.status(401)
         throw new Error('Not authorized to view this order')
    }
    res.json(order)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// @desc    Update order to paid (Crucial for Payment Gateway integration)
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)

    if (order) {
        order.isPaid = true
        order.paidAt = Date.now()
        // req.body contains payment result from Stripe/PayPal API response
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address,
        }

        const updatedOrder = await order.save()
        res.json(updatedOrder)
    } else {
        res.status(404)
        throw new Error('Order not found')
    }
})


// /backend/controllers/orderController.js (Changes in updateOrderToDelivered function)

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)

    if (order) {
        order.isDelivered = true
        order.deliveredAt = Date.now()
        
        // 🔑 NEW LOGIC: If the order was PENDING PAYMENT (i.e., Payment on Delivery),
        // marking it as delivered means the payment has been collected successfully.
        if (order.paymentMethod === 'Payment on Delivery' && !order.isPaid) {
            order.isPaid = true
            order.paidAt = Date.now() // Record the time payment was confirmed/collected
            // Note: You may want to add a field like 'paymentCollectedByAdmin'
        }

        const updatedOrder = await order.save()
        res.json(updatedOrder)
    } else {
        res.status(404)
        throw new Error('Order not found')
    }
})



// @desc    Get logged in user's orders (History)
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    // Find orders where the user field matches the logged-in user's ID
    const orders = await Order.find({ user: req.user._id })
    res.json(orders)
})

// @desc    Admin: Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    // Get all orders and pull in the user's ID and name for easy viewing
    const orders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 })
    res.json(orders)
})


module.exports = {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToDelivered
}