// /server/routes/configRoutes.js

import express from 'express'
const router = express.Router()

// @desc    Get PayPal client ID
// @route   GET /api/config/paypal
// @access  Public
router.get('/paypal', (req, res) => {
    // Note: process.env.PAYPAL_CLIENT_ID is for your Node.js backend environment (.env file)
    res.send(process.env.PAYPAL_CLIENT_ID)
})

export default router