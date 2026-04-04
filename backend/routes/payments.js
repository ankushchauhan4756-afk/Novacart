import express from 'express'
import Razorpay from 'razorpay'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import mongoose from 'mongoose'
import Order from '../models/Order.js'
import { config } from '../config/config.js'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: config.RAZORPAY_KEY_ID,
  key_secret: config.RAZORPAY_KEY_SECRET,
})

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '')

  if (!token) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('No token provided, using development mock user for payments')
      req.user = {
        id: '2',
        email: 'user@novacart.com',
        isAdmin: false,
      }
      return next()
    }

    return res.status(401).json({ message: 'No token provided' })
  }

  try {
    // Allow mock tokens in development
    if (process.env.NODE_ENV === 'development' && token.startsWith('mock-token-')) {
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

const isValidRazorpayKey = (key) => {
  return typeof key === 'string' &&
    key.length > 0 &&
    !key.includes('your_razorpay') &&
    !key.includes('your_key') &&
    !key.includes('your_secret') &&
    !key.includes('example')
}

// Create Razorpay order
router.post('/create-order', verifyToken, async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body

    // Validate required fields
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid amount is required' })
    }

    const isRealPaymentEnabled = !config.RAZORPAY_MOCK_MODE &&
      isValidRazorpayKey(config.RAZORPAY_KEY_ID) &&
      isValidRazorpayKey(config.RAZORPAY_KEY_SECRET)

    if (!isRealPaymentEnabled) {
      console.warn('Razorpay mock mode enabled: using simulated payment order')
      const order = {
        id: `mock_order_${Date.now()}`,
        amount: amount * 100,
        currency,
        receipt: receipt || `receipt_${Date.now()}`,
        status: 'created',
      }

      return res.json({
        success: true,
        mock: true,
        order,
        keyId: 'rzp_test_dummy_key',
        message: 'Razorpay keys not configured; using mock payment flow',
      })
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1, // Auto capture payment
    }

    const order = await razorpay.orders.create(options)

    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
      },
      keyId: config.RAZORPAY_KEY_ID,
    })
  } catch (error) {
    console.error('Razorpay order creation error:', error)
    res.status(500).json({
      message: error?.error_description || error?.message || 'Failed to create payment order',
      error: error.message
    })
  }
})

// Test endpoint - Check all orders (public)
router.get('/test/all-orders', async (req, res) => {
  try {
    const allOrders = await Order.find().lean()
    res.json({
      totalOrders: allOrders.length,
      orders: allOrders
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Verify payment and update order
router.post('/verify', verifyToken, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
      mock
    } = req.body

    console.log('=== Payment Verification Started ===')
    console.log('User ID:', req.user.id)
    console.log('Order Data:', orderData)
    console.log('Razorpay IDs - Order:', razorpay_order_id, 'Payment:', razorpay_payment_id)

    const isRealPaymentEnabled = !config.RAZORPAY_MOCK_MODE &&
      isValidRazorpayKey(config.RAZORPAY_KEY_ID) &&
      isValidRazorpayKey(config.RAZORPAY_KEY_SECRET)

    console.log('Is Real Payment Enabled:', isRealPaymentEnabled)

    if (isRealPaymentEnabled && !mock) {
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        console.log('Missing payment details')
        return res.status(400).json({
          success: false,
          message: 'Missing Razorpay payment details for verification'
        })
      }

      const sign = razorpay_order_id + '|' + razorpay_payment_id
      const expectedSign = crypto
        .createHmac('sha256', config.RAZORPAY_KEY_SECRET)
        .update(sign.toString())
        .digest('hex')

      let paymentVerified = razorpay_signature === expectedSign

      console.log('Signature match:', paymentVerified)

      if (!paymentVerified) {
        // Fallback: verify payment directly from Razorpay to handle any signature edge cases
        console.log('Attempting Razorpay API verification...')
        const payment = await razorpay.payments.fetch(razorpay_payment_id)
        console.log('Payment from Razorpay:', payment.status)
        paymentVerified =
          payment &&
          payment.order_id === razorpay_order_id &&
          ['captured', 'authorized'].includes(payment.status)
        console.log('API verification result:', paymentVerified)
      }

      if (!paymentVerified) {
        console.log('Payment verification failed')
        return res.status(400).json({
          success: false,
          message: 'Payment verification failed'
        })
      }
    } else {
      if (!razorpay_order_id) {
        console.log('Missing order ID for mock mode')
        return res.status(400).json({
          success: false,
          message: 'Missing mock payment order id'
        })
      }
    }

    console.log('Payment verified successfully, creating order...')

    // Create the order in database after successful payment
    const {
      items,
      shippingAddress,
      paymentMethod,
      couponCode
    } = orderData

    if (!items || items.length === 0) {
      console.log('Items validation failed')
      return res.status(400).json({ message: 'Cart is empty' })
    }

    const orderId = `ORD-${Date.now()}`
    console.log('Generated Order ID:', orderId)

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0)
    const shipping = subtotal > 500 ? 0 : 100
    const tax = Math.round(subtotal * 0.1)
    const total = subtotal + shipping + tax

    console.log('Totals - Subtotal:', subtotal, 'Shipping:', shipping, 'Tax:', tax, 'Total:', total)

    // Convert user ID to ObjectId safely
    let userId
    try {
      if (process.env.NODE_ENV === 'development' && typeof req.user.id === 'string') {
        const id = req.user.id
        if (id.match(/^[0-9a-f]{24}$/i)) {
          userId = new mongoose.Types.ObjectId(id)
        } else {
          const paddedId = id.padStart(24, '0')
          userId = new mongoose.Types.ObjectId(paddedId)
        }
      } else {
        userId = new mongoose.Types.ObjectId(req.user.id)
      }
      console.log('User ID conversion successful:', userId)
    } catch (err) {
      console.log('User ID conversion error:', err.message)
      if (process.env.NODE_ENV === 'development') {
        userId = new mongoose.Types.ObjectId('000000000000000000000002')
        console.log('Using default dev user ID:', userId)
      } else {
        return res.status(400).json({ message: 'Invalid user ID format' })
      }
    }

    // Process items
    const processedItems = items.map(item => ({
      product: item.product,
      quantity: item.quantity || 1,
      price: item.price || 0,
      discount: item.discount || 0,
    }))

    console.log('Processed items:', processedItems)

    const order = new Order({
      orderId,
      user: userId,
      items: processedItems,
      subtotal,
      shipping,
      tax,
      total,
      paymentMethod: paymentMethod || 'razorpay',
      shippingAddress,
      couponCode,
      orderStatus: 'confirmed',
      paymentStatus: 'completed',
      trackingHistory: [
        {
          status: 'confirmed',
          location: 'Order confirmed',
          timestamp: new Date(),
          note: 'Payment verified',
        },
      ],
      razorpayPaymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      transactionId: razorpay_payment_id,
    })

    console.log('Order object created, saving to database...')
    console.log('Order data to save:', JSON.stringify(order, null, 2))
    
    // Validate order before saving
    const validationError = order.validateSync()
    if (validationError) {
      console.log('Order validation error:', validationError)
      return res.status(400).json({
        success: false,
        message: 'Order validation failed',
        validation: validationError.message
      })
    }

    const savedOrder = await order.save()
    console.log('Order saved successfully with ID:', savedOrder._id)
    console.log('Saved order:', JSON.stringify(savedOrder, null, 2))

    // Clear cart (assuming cart service exists)
    // await Cart.findOneAndDelete({ user: userId })

    res.json({
      success: true,
      message: 'Payment verified and order created successfully',
      order: savedOrder,
    })
  } catch (error) {
    console.error('=== Payment verification error ===')
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    })
  }
})

// Get payment status
router.get('/:paymentId', verifyToken, async (req, res) => {
  try {
    const { paymentId } = req.params

    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(paymentId)

    res.json({
      paymentId: payment.id,
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
      method: payment.method,
      createdAt: new Date(payment.created_at * 1000),
      orderId: payment.order_id,
    })
  } catch (error) {
    console.error('Payment status fetch error:', error)
    res.status(500).json({
      message: 'Failed to fetch payment status',
      error: error.message
    })
  }
})

export default router
