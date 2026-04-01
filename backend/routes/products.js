import express from 'express'
import Product from '../models/Product.js'

const router = express.Router()

// Get all products with filters
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search, sortBy, limit = 12, page = 1 } = req.query

    let filter = { status: 'active' }

    if (category) {
      filter.category = category
    }

    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = parseFloat(minPrice)
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice)
    }

    if (search) {
      filter.$text = { $search: search }
    }

    let sortObj = {}
    if (sortBy === 'newest') {
      sortObj = { createdAt: -1 }
    } else if (sortBy === 'price-low') {
      sortObj = { price: 1 }
    } else if (sortBy === 'price-high') {
      sortObj = { price: -1 }
    } else if (sortBy === 'rating') {
      sortObj = { rating: -1 }
    } else {
      sortObj = { createdAt: -1 }
    }

    const products = await Product.find(filter)
      .sort(sortObj)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))

    const total = await Product.countDocuments(filter)

    res.json({
      products,
      pagination: {
        total,
        pages: Math.ceil(total / parseInt(limit)),
        currentPage: parseInt(page),
      },
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('seller', 'name email')

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json(product)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Search products
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query

    if (!q) {
      return res.status(400).json({ message: 'Search query required' })
    }

    const products = await Product.find(
      { $text: { $search: q }, status: 'active' },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } })

    res.json(products)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Get trending products
router.get('/trending', async (req, res) => {
  try {
    const products = await Product.find({ isTrending: true, status: 'active' })
      .limit(12)
      .sort({ sales: -1 })

    res.json(products)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Get featured products
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true, status: 'active' })
      .limit(8)

    res.json(products)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Get by category
router.get('/category/:category', async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.category,
      status: 'active',
    }).limit(20)

    res.json(products)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

export default router
