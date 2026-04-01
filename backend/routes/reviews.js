import express from 'express'
import Review from '../models/Review.js'
import Product from '../models/Product.js'
import jwt from 'jsonwebtoken'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ message: 'No token provided' })
  }

  try {
    // Allow mock tokens in development
    if (process.env.NODE_ENV === 'development' && token.startsWith('mock-token-')) {
      // Extract user id from mock token
      const isMockAdmin = token === 'mock-token-admin'
      req.user = {
        id: isMockAdmin ? '1' : '2',
        email: isMockAdmin ? 'admin@novacart.com' : 'user@novacart.com',
        isAdmin: isMockAdmin
      }
      return next()
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
}

// Get product reviews
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
      status: 'approved',
    })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })

    res.json(reviews)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Create review
router.post('/', verifyToken, async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body

    // Check if product exists
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    // Check if user already reviewed
    const existingReview = await Review.findOne({
      product: productId,
      user: req.user.id,
    })

    if (existingReview) {
      return res.status(400).json({ message: 'You already reviewed this product' })
    }

    const review = new Review({
      product: productId,
      user: req.user.id,
      rating,
      title,
      comment,
      status: 'approved', // Auto-approve for demo
    })

    await review.save()

    // Update product rating
    const allReviews = await Review.find({ product: productId, status: 'approved' })
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length

    await Product.findByIdAndUpdate(
      productId,
      { rating: Math.round(avgRating * 10) / 10, reviews: allReviews.length },
      { new: true }
    )

    res.status(201).json({ message: 'Review created', review })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Update review
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user.id,
    })

    if (!review) {
      return res.status(404).json({ message: 'Review not found' })
    }

    review.rating = req.body.rating || review.rating
    review.title = req.body.title || review.title
    review.comment = req.body.comment || review.comment

    await review.save()

    res.json({ message: 'Review updated', review })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Delete review
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user.id,
    })

    if (!review) {
      return res.status(404).json({ message: 'Review not found' })
    }

    await Review.findByIdAndDelete(req.params.id)

    res.json({ message: 'Review deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

export default router
