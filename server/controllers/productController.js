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
    const pageSize = 10
    const page = Number(req.query.pageNumber) || 1

    // 2. Search keyword setup (keep existing)
    const keyword = req.query.keyword
        ? {
              name: {
                  $regex: req.query.keyword,
                  $options: 'i', // case-insensitive
              },
          }
        : {}
    
    // 3. Brand Filter setup (NEW)
    // Brands will be passed as a comma-separated string: ?brands=Apple,Samsung
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


    // Combine all filters: search keyword, brand filter, and any other future filters
    const filter = { ...keyword, ...brandFilter }

    const count = await Product.countDocuments({ ...filter })

    const products = await Product.find({ ...filter })
        .limit(pageSize)
        .skip(pageSize * (page - 1))

    res.json({ products, page, pages: Math.ceil(count / pageSize) })
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

// @desc    Admin: Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  // Create a sample product with default data. Admin can then edit it.
  const product = new Product({
    name: 'Sample Name',
    price: 0,
    user: req.user._id, // User ID is attached via the 'protect' middleware
    image: '/images/sample.jpg', // Placeholder image
    brand: 'Sample Brand',
    category: 'Sample Category',
    countInStock: 0,
    description: 'Sample description',
    rating: 0,
    numReviews: 0,
  })

  const createdProduct = await product.save()
  res.status(201).json(createdProduct) // 201: Created
})

// @desc    Admin: Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const {
        name, price, description, image, brand, category,
        countInStock, specs
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

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
}