const asyncHandler = require('express-async-handler')
const Product = require('../models/Product')

// @desc    A simple Fetch all products check the updated one below this
// @route   GET /api/products
// @access  Public
// const getProducts = asyncHandler(async (req, res) => {
//   const products = await Product.find({}) // {} means find all
//   res.json(products)
// })



// @desc    Fetch all products with filtering by brands, keyword search, and pagination
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    // 1. Pagination setup (keep existing)
    const pageSize = 20
    const page = Number(req.query.pageNumber) || 1

    // 2. Search keyword setup
    const keyword = req.query.keyword
        ? {
              name: {
                  $regex: req.query.keyword,
                  $options: 'i', // case-insensitive
              },
          }
        : {}
    
    // 3. Brand Filter setup --> Brands will be passed as a comma-separated string: ?brands=Apple,Samsung
    let brandFilter = {}
    if (req.query.brands) {
        // Create an array of brands from the comma-separated string
        const selectedBrands = req.query.brands.split(',') 
        
        // Build the MongoDB filter: find products where 'brand' is IN the selectedBrands array
        brandFilter = {
            brand: {
                $in: selectedBrands
            }
        }
    }

    // 🔑 UPDATED: Category Filter Setup (now supports multiple, uses $in)
    let categoryFilter = {}
    if (req.query.categories) { // looks for 'categories' (plural)
        const selectedCategories = req.query.categories.split(',') 
        categoryFilter = { category: { $in: selectedCategories } } // Use $in for multiple categories
    }


    // Combine all filters: search keyword, brand filter, category filter and any other future filters
    const filter = { ...keyword, ...brandFilter, ...categoryFilter }

    const count = await Product.countDocuments({ ...filter })

    const products = await Product.find({ ...filter })
        .limit(pageSize)
        .skip(pageSize * (page - 1))

    res.json({ products, page, pages: Math.ceil(count / pageSize) })
})


// @desc    Get unique brands and categories for filter sidebar
// @route   GET /api/products/options
// @access  Public
const getFilterOptions = asyncHandler(async (req, res) => {
    // 1. Get unique brands
    // Group all products by their 'brand' field
    const uniqueBrands = await Product.aggregate([
        { 
            $group: { 
                _id: '$brand', 
                count: { $sum: 1 } // Count how many products are in this group (optional, but helpful)
            } 
        },
        { $sort: { _id: 1 } } // Sort by brand name ascending
    ])

    // 2. Get unique categories
    // Group all products by their 'category' field
    const uniqueCategories = await Product.aggregate([
        { 
            $group: { 
                _id: '$category', 
                count: { $sum: 1 } 
            } 
        },
        { $sort: { _id: 1 } } // Sort by category name ascending
    ])

    // Format the data for the frontend
    const brands = uniqueBrands.map(item => ({ name: item._id, count: item.count }))
    const categories = uniqueCategories.map(item => item._id) // Just return the names

    res.json({ brands, categories })
})


// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    res.json(product)
  } else {
    res.status(404) // Not Found
    throw new Error('Product not found')
  }
})

// /backend/controllers/productController.js (UPDATED createProduct)

// @desc    Admin: Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  // 🔑 Extract ALL fields from the request body sent from the frontend form.
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
    isFeatured,
  } = req.body

  // 🔑 Create the product using the provided data.
  const product = new Product({
    user: req.user._id, // Set the user (Admin) who created it
    name: name,
    price: price,
    description: description,
    image: image || '/images/sample.jpg', // Use passed image or default
    brand: brand,
    category: category,
    countInStock: countInStock || 0,
    isFeatured: isFeatured || false,
    rating: 0,
    numReviews: 0,
  })

  const createdProduct = await product.save()
  res.status(201).json(createdProduct)
})




// @desc    Admin: Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const {
        name, 
        price, 
        description, 
        image, 
        brand, 
        category,
        countInStock, 
        specs, 
        isFeatured, // 🔑 NEW: Destructure isFeatured from the request body
    } = req.body

    const product = await Product.findById(req.params.id)

    if (product) {
        // Update fields
        product.name = name || product.name
        product.price = price || product.price
        product.description = description || product.description
        product.image = image || product.image
        product.brand = brand || product.brand
        product.category = category || product.category
        product.countInStock = countInStock || product.countInStock
        product.specs = specs || product.specs // Update nested specs object
        // 🔑 APPLY NEW FIELD: Update the isFeatured field
        product.isFeatured = isFeatured

        const updatedProduct = await product.save()
        res.json(updatedProduct)
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

// @desc    Admin: Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if (product) {
        await product.deleteOne() // Use deleteOne for mongoose 6+
        res.json({ message: 'Product removed' })
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body

  const product = await Product.findById(req.params.id)

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    )

    if (alreadyReviewed) {
      res.status(400) // Bad request
      throw new Error('Product already reviewed')
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    }

    product.reviews.push(review)
    product.numReviews = product.reviews.length

    // Calculate new average rating
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length

    await product.save()
    res.status(201).json({ message: 'Review added' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Fetch specialized product lists for the homepage; new arrivals, best sellers, featured
// @route   GET /api/products/homepage
// @access  Public
const getHomepageProducts = asyncHandler(async (req, res) => {
    
    // 1. Fetch New Arrivals (Latest 8 products)
    const newArrivals = await Product.find({})
        .sort({ createdAt: -1 }) // Sort by creation date (descending)
        .limit(8)
    
    // 2. Fetch Best Sellers (Top 8 based on total sales/reviews - using numReviews as a proxy)
    // NOTE: A more accurate best-seller logic would involve aggregating data from the Order model.
    // For now, using 'numReviews' as a common proxy for popularity/sales.
    const bestSellers = await Product.find({})
        .sort({ numReviews: -1 }) // Sort by number of reviews (descending)
        .limit(8)
        
    // 3. Fetch Featured Products (Products flagged by the admin)
    const featuredProducts = await Product.find({ isFeatured: true })
        .limit(8)
        
    // Return all three lists in one response
    res.json({ 
        newArrivals,
        bestSellers,
        featuredProducts,
    })
})

// ... make sure to export the new function
module.exports = {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
    createProductReview,
    //getTopProducts,
    getHomepageProducts, //Export the new function
    getFilterOptions,
}