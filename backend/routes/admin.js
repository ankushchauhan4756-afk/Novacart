import express from 'express'
import mongoose from 'mongoose'
import Product from '../models/Product.js'
import Order from '../models/Order.js'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import { updateOrderStatus } from '../controllers/orderController.js'

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

// Test endpoint - Verify admin auth
router.get('/test/verify-admin', verifyToken, async (req, res) => {
  try {
    console.log('Admin verification test - User:', req.user)
    res.json({
      message: 'Admin verified',
      user: req.user,
      isAdmin: req.user.isAdmin,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Dashboard stats
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments()
    const totalUsers = await User.countDocuments()
    const totalProducts = await Product.countDocuments()
    
    const totalSales = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$total' } } },
    ])

    console.log('Dashboard Stats - Total Orders:', totalOrders, 'Total Users:', totalUsers, 'Total Products:', totalProducts)

    res.json({
      totalOrders,
      totalUsers,
      totalProducts,
      totalSales: totalSales[0]?.total || 0,
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Test endpoint - Check orders count
router.get('/test/count-orders', async (req, res) => {
  try {
    console.log('=== Checking order count in database ===')
    const count = await Order.countDocuments()
    const orders = await Order.find().select('orderId user items total orderStatus paymentStatus createdAt').lean()
    
    console.log('Total orders:', count)
    console.log('Order details:', orders)
    
    res.json({
      message: 'Order count check',
      totalOrders: count,
      orders: orders,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Debug endpoint - Check orders in database
router.get('/debug/check-orders', verifyToken, async (req, res) => {
  try {
    console.log('=== DEBUG: Checking Orders in Database ===')
    
    const allOrders = await Order.find().select('orderId orderStatus user items total createdAt').lean()
    const orderCount = await Order.countDocuments()
    
    console.log('Total orders in DB:', orderCount)
    console.log('Orders:', allOrders)
    
    res.json({
      message: 'Debug check',
      totalOrders: orderCount,
      orders: allOrders,
    })
  } catch (error) {
    console.error('Debug check error:', error)
    res.status(500).json({ message: 'Debug error', error: error.message })
  }
})

// Get all products (admin)
router.get('/products', verifyToken, async (req, res) => {
  try {
    const { search, category, status, limit = 20, page = 1 } = req.query

    let filter = {}
    if (search) filter.name = { $regex: search, $options: 'i' }
    if (category) filter.category = category
    if (status) filter.status = status

    const products = await Product.find(filter)
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

// Create product
router.post('/products', verifyToken, async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      seller: req.user.id,
    })

    await product.save()

    res.status(201).json({
      message: 'Product created',
      product,
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Update product
router.put('/products/:id', verifyToken, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.json(product)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Delete product
router.delete('/products/:id', verifyToken, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)

    res.json({ message: 'Product deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Get all orders
router.get('/orders', verifyToken, async (req, res) => {
  try {
    const { status, limit = 20, page = 1 } = req.query

    let filter = {}
    if (status) filter.orderStatus = status

    console.log('Admin orders request - Filter:', filter, 'Page:', page, 'Limit:', limit)

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean()

    console.log('Orders found from DB:', orders.length)
    console.log('First order sample:', orders[0])

    // Manually populate user, product, and delivery boy data
    const populatedOrders = await Promise.all(
      orders.map(async (order) => {
        const user = mongoose.isValidObjectId(order.user)
          ? await User.findById(order.user).select('name email phone').lean()
          : null

        const deliveryBoy = order.deliveryBoy && mongoose.isValidObjectId(order.deliveryBoy)
          ? await User.findById(order.deliveryBoy).select('name email phone').lean()
          : null

        const itemsWithProducts = await Promise.all(
          order.items.map(async (item) => {
            let product = null
            if (mongoose.isValidObjectId(item.product)) {
              product = await Product.findById(item.product).select('name price').lean()
            }
            return {
              ...item,
              product: product || { id: item.product, name: 'Unknown product', price: item.price || 0 },
            }
          })
        )

        return { ...order, user, items: itemsWithProducts, deliveryBoy }
      })
    )

    const total = await Order.countDocuments(filter)

    console.log('Total orders in DB:', total)
    console.log('Returning populated orders:', populatedOrders.length)

    res.json({
      orders: populatedOrders,
      pagination: {
        total,
        pages: Math.ceil(total / parseInt(limit)),
        currentPage: parseInt(page),
      },
    })
  } catch (error) {
    console.error('Admin orders error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Get all users
router.get('/users', verifyToken, async (req, res) => {
  try {
    const { search, limit = 20, page = 1 } = req.query

    let filter = {}
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ]
    }

    const users = await User.find(filter)
      .select('-password')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))

    const total = await User.countDocuments(filter)

    res.json({
      users,
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

// Get all delivery boys
router.get('/delivery-boys', verifyToken, async (req, res) => {
  try {
    const deliveryBoys = await User.find({ role: 'deliveryBoy', status: 'active' })
      .select('name email phone address status')
      .lean()

    res.json({ deliveryBoys })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Assign delivery boy to order
router.patch('/orders/:id/assign-delivery-boy', verifyToken, async (req, res) => {
  try {
    const { deliveryBoyId } = req.body
    const orderId = req.params.id

    // Validate delivery boy exists and is active
    const deliveryBoy = await User.findById(deliveryBoyId)
    if (!deliveryBoy || deliveryBoy.role !== 'deliveryBoy' || deliveryBoy.status !== 'active') {
      return res.status(400).json({ message: 'Invalid delivery boy' })
    }

    // Update order with delivery boy
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        deliveryBoy: deliveryBoyId,
        deliveryBoyAssignedAt: new Date(),
      },
      { new: true }
    )
      .populate('user', 'name email phone')
      .populate('deliveryBoy', 'name email phone')

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    res.json({
      message: 'Delivery boy assigned successfully',
      order,
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Update order status
router.patch('/orders/:id/status', verifyToken, updateOrderStatus)

export default router
