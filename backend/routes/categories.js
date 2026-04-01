import express from 'express'
import Category from '../models/Category.js'
import jwt from 'jsonwebtoken'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Middleware to verify token for admin
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
      if (!isMockAdmin) {
        return res.status(403).json({ message: 'Admin access required' })
      }
      req.user = {
        id: '1',
        email: 'admin@novacart.com',
        isAdmin: true
      }
      return next()
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' })
    }
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
}

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ displayOrder: 1 })

    res.json(categories)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Get category by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)

    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }

    res.json(category)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Create category (admin)
router.post('/', verifyToken, async (req, res) => {
  try {
    const category = new Category({
      ...req.body,
      slug: req.body.name.toLowerCase().replace(/\s+/g, '-'),
    })

    await category.save()

    res.status(201).json({ message: 'Category created', category })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Update category (admin)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })

    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }

    res.json(category)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Delete category (admin)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id)

    res.json({ message: 'Category deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

export default router
