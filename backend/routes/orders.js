import express from 'express'
import mongoose from 'mongoose'
import Order from '../models/Order.js'
import Cart from '../models/Cart.js'
import jwt from 'jsonwebtoken'
import { updateOrderStatus } from '../controllers/orderController.js'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  console.log('[ORDER] Auth Header:', req.headers.authorization)
  console.log('[ORDER] Token:', token)
  console.log('[ORDER] NODE_ENV:', process.env.NODE_ENV)
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' })
  }

  try {
    // Allow mock tokens in development
    if (process.env.NODE_ENV === 'development' && token.startsWith('mock-token-')) {
      console.log('[ORDER] Using mock token')
      // Use properly formatted ObjectId for mock users
      const isMockAdmin = token === 'mock-token-admin'
      // Convert to proper ObjectId format (24 hex chars)
      const adminId = '000000000000000000000001' // 1 in hex
      const userId = '000000000000000000000002'  // 2 in hex
      req.user = {
        id: isMockAdmin ? adminId : userId,
        email: isMockAdmin ? 'admin@novacart.com' : 'user@novacart.com',
        isAdmin: isMockAdmin
      }
      console.log('[ORDER] Mock user set:', req.user)
      return next()
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
}

// Create order
router.post('/', verifyToken, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, couponCode } = req.body

    console.log('[ORDER CREATE] Received items:', JSON.stringify(items))
    
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' })
    }

    if (!shippingAddress) {
      return res.status(400).json({ message: 'Shipping address is required' })
    }

    const orderId = `ORD-${Date.now()}`

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0)
    const shipping = subtotal > 500 ? 0 : 100
    const tax = Math.round(subtotal * 0.1)
    const total = subtotal + shipping + tax

    // Convert user ID to ObjectId safely
    let userId
    try {
      // In development with mock tokens, use a standard format
      if (process.env.NODE_ENV === 'development' && typeof req.user.id === 'string') {
        const id = req.user.id
        // If it's already 24 hex chars, use as-is
        if (id.match(/^[0-9a-f]{24}$/i)) {
          userId = new mongoose.Types.ObjectId(id)
        } else {
          // Otherwise pad it
          const paddedId = id.padStart(24, '0')
          userId = new mongoose.Types.ObjectId(paddedId)
        }
      } else {
        userId = new mongoose.Types.ObjectId(req.user.id)
      }
      console.log('[ORDER CREATE] User ID converted to ObjectId:', userId.toString())
    } catch (err) {
      console.error('[ORDER CREATE] Error converting user ID:', req.user.id, err.message)
      // In development, use a fallback ObjectId
      if (process.env.NODE_ENV === 'development') {
        userId = new mongoose.Types.ObjectId('000000000000000000000002')
        console.log('[ORDER CREATE] Using fallback user ID:', userId)
      } else {
        return res.status(400).json({ message: 'Invalid user ID format' })
      }
    }

    // Process items - store product IDs as-is (string or number, don't force ObjectId)
    const processedItems = items.map(item => ({
      product: item.product, // Keep original format - let MongoDB handle it
      quantity: item.quantity || 1,
      price: item.price || 0,
      discount: item.discount || 0,
    }))

    const order = new Order({
      orderId,
      user: userId,
      items: processedItems,
      subtotal,
      shipping,
      tax,
      total,
      paymentMethod: paymentMethod || 'card',
      shippingAddress,
      couponCode,
      orderStatus: 'pending',
      paymentStatus: 'pending',
      trackingHistory: [
        {
          status: 'pending',
          location: 'Order placed',
          timestamp: new Date(),
          note: 'Order created',
        },
      ],
    })

    console.log('[ORDER CREATE] Saving order:', orderId)
    
    const savedOrder = await order.save()
    console.log('[ORDER CREATE] Order saved successfully:', savedOrder._id)

    // Clear cart
    await Cart.findOneAndDelete({ user: userId })
    console.log('[ORDER CREATE] Cart cleared')

    res.status(201).json({
      message: 'Order created successfully',
      order: savedOrder,
    })
  } catch (error) {
    console.error('[ORDER CREATE] Error:', error.message)
    console.error('[ORDER CREATE] Full Error:', error)
    res.status(500).json({ 
      message: 'Server error creating order',
      error: error.message,
    })
  }
})

// Get user orders
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id)
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name image price')

    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Get order by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id)
    const order = await Order.findOne({
      _id: req.params.id,
      user: userId,
    }).populate('items.product')

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    res.json(order)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Update order status (admin only)
router.put('/:id/status', verifyToken, updateOrderStatus)

// Cancel order
router.post('/:id/cancel', verifyToken, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id)
    const order = await Order.findOne({
      _id: req.params.id,
      user: userId,
    })

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    if (!['pending', 'confirmed'].includes(order.orderStatus)) {
      return res.status(400).json({ message: 'Cannot cancel this order' })
    }

    order.orderStatus = 'cancelled'
    order.statusHistory.push({
      status: 'cancelled',
      timestamp: new Date(),
      note: 'Cancelled by user',
    })

    await order.save()

    res.json({ message: 'Order cancelled', order })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

export default router
