import express from 'express'
import Coupon from '../models/Coupon.js'
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

// Validate coupon
router.post('/validate', async (req, res) => {
  try {
    const { code, orderAmount } = req.body

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
    })

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' })
    }

    // Check if expired
    if (new Date() > coupon.endDate) {
      return res.status(400).json({ message: 'Coupon expired' })
    }

    // Check if usage limit reached
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return res.status(400).json({ message: 'Coupon usage limit reached' })
    }

    // Check minimum order amount
    if (orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({
        message: `Minimum order amount is ₹${coupon.minOrderAmount}`,
      })
    }

    // Calculate discount
    let discountAmount = 0
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((orderAmount * coupon.discountValue) / 100)
    } else {
      discountAmount = coupon.discountValue
    }

    // Apply max discount cap if set
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount
    }

    res.json({
      valid: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
      },
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Get coupon details
router.get('/:code', async (req, res) => {
  try {
    const coupon = await Coupon.findOne({
      code: req.params.code.toUpperCase(),
      isActive: true,
    })

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' })
    }

    res.json(coupon)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Create coupon (admin only)
router.post('/', verifyToken, async (req, res) => {
  try {
    // Verify admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' })
    }

    const coupon = new Coupon(req.body)
    await coupon.save()

    res.status(201).json({ message: 'Coupon created', coupon })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

export default router
