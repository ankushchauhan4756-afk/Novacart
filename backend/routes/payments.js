import express from 'express'
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

// Initiate payment (Razorpay simulation)
router.post('/initiate', verifyToken, async (req, res) => {
  try {
    const { orderId, amount } = req.body

    // Mock Razorpay order creation
    const razorpayOrder = {
      id: `order_${Date.now()}`,
      amount: amount * 100, // Razorpay uses paise
      currency: 'INR',
      receipt: orderId,
      status: 'created',
    }

    res.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: 'rzp_test_dummy_key',
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Verify payment
router.post('/verify', verifyToken, async (req, res) => {
  try {
    const { paymentId, orderId } = req.body

    // Mock payment verification
    // In production, verify with Razorpay API

    res.json({
      success: true,
      message: 'Payment verified successfully',
      paymentId,
      orderId,
      status: 'captured',
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Get payment status
router.get('/:paymentId', verifyToken, async (req, res) => {
  try {
    // Mock payment status check
    res.json({
      paymentId: req.params.paymentId,
      status: 'captured',
      amount: 50000,
      currency: 'INR',
      createdAt: new Date(),
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

export default router
