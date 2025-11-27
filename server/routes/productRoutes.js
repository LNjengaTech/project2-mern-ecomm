const express = require('express')
const router = express.Router()
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  //getTopProducts,
  getHomepageProducts,
  getFilterOptions,
} = require('../controllers/productController')
const { protect, admin } = require('../middleware/authMiddleware') // Need protect & admin middleware

// NOTE: Specific routes MUST come before generic routes like '/:id'
//router.route('/top').get(getTopProducts)


// General products route (includes filtration, pagination, and creation)
router.route('/')
  .get(getProducts)       // Public route for fetching all products
  .post(protect, admin, createProduct) // Private/Admin route for creating a product

  // 🔑 NEW ROUTE: For fetching the three homepage lists
router.route('/homepage').get(getHomepageProducts)

// 🔑 NEW ROUTE: For fetching filter options (brands, categories )
router.route('/options').get(getFilterOptions)

  
// Individual product routes
router.route('/:id')
  .get(getProductById)    // Public route for fetching a single product
  .put(protect, admin, updateProduct)   // Private/Admin route for updating
  .delete(protect, admin, deleteProduct) // Private/Admin route for deleting

router.route('/:id/reviews').post(protect, createProductReview)

module.exports = router