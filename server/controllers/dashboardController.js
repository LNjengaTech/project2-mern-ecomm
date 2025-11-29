// /backend/controllers/dashboardController.js

const asyncHandler = require('express-async-handler')
const Order = require('../models/Order')

// @desc    Get dashboard summary data (stats, revenue, recent orders)
// @route   GET /api/dashboard
// @access  Private/Admin
const getDashboardData = asyncHandler(async (req, res) => {
    
    // 1. Calculate Summary Statistics (Sales & Order Counts)
    const summaryData = await Order.aggregate([
        {
            $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                totalSales: { $sum: '$totalPrice' },
                
                // Delivered Orders
                deliveredOrders: { $sum: { $cond: ['$isDelivered', 1, 0] } },
                deliveredSales: { $sum: { $cond: ['$isDelivered', '$totalPrice', 0] } },
                
                // Pending Orders (Paid but not Delivered)
                pendingOrders: { $sum: { $cond: [{ $and: ['$isPaid', { $eq: ['$isDelivered', false] }] }, 1, 0] } },
                pendingSales: { $sum: { $cond: [{ $and: ['$isPaid', { $eq: ['$isDelivered', false] }] }, '$totalPrice', 0] } },
                
                // Cancelled/Unpaid Orders (Assuming not paid means potentially canceled or abandoned)
                cancelledOrders: { $sum: { $cond: ['$isPaid', 0, 1] } }, // simplified: if not paid, count as unpaid/cancelled
                cancelledSales: { $sum: { $cond: ['$isPaid', 0, '$totalPrice'] } },
            },
        },
        // Optionally, reshape the output to remove the _id: null field
        {
            $project: {
                _id: 0,
                totalOrders: 1,
                totalSales: 1,
                deliveredOrders: 1,
                deliveredSales: 1,
                pendingOrders: 1,
                pendingSales: 1,
                cancelledOrders: 1,
                cancelledSales: 1,
            }
        }
    ])

    // 2. Calculate Monthly Revenue (Grouped by Month)
    const monthlyRevenue = await Order.aggregate([
        // Only consider delivered/paid orders for revenue chart
        {
            $match: {
                isPaid: true,
                // Only consider the last 12 months for better chart data
                createdAt: { $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) }
            }
        },
        {
            $group: {
                _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
                totalSales: { $sum: '$totalPrice' },
                totalOrders: { $sum: 1 },
            },
        },
        {
            $sort: { '_id.year': 1, '_id.month': 1 }
        }
    ])

    // 3. Fetch Recent Orders (Last 5 orders)
    const recentOrders = await Order.find({})
        .sort({ createdAt: -1 }) // Sort by newest first
        .limit(5)
        .populate('user', 'id name') // Populate user name for the table

    // Send the consolidated data to the frontend
    res.json({
        summary: summaryData[0] || {}, // summaryData is an array, take the first element
        revenue: monthlyRevenue,
        orders: recentOrders,
    })
})

module.exports = { getDashboardData }