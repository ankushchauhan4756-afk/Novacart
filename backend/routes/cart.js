import express from 'express'
import Cart from '../models/Cart.js'
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

// Get cart
router.get('/', verifyToken, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product')

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [], total: 0 })
      await cart.save()
    }

    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Add to cart
router.post('/', verifyToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' })
    }

    let cart = await Cart.findOne({ user: req.user.id })

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] })
    }

    // Check if item already in cart
    const existingItem = cart.items.find((item) => item.product.toString() === productId)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
      })
    }

    // Calculate total
    cart.total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    await cart.save()
    await cart.populate('items.product')

    res.json({ message: 'Item added to cart', cart })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Update cart item
router.put('/:productId', verifyToken, async (req, res) => {
  try {
    const { quantity } = req.body

    const cart = await Cart.findOne({ user: req.user.id })
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' })
    }

    const item = cart.items.find((item) => item.product.toString() === req.params.productId)
    if (!item) {
      return res.status(404).json({ message: 'Item not in cart' })
    }

    if (quantity <= 0) {
      // Remove item
      cart.items = cart.items.filter((item) => item.product.toString() !== req.params.productId)
    } else {
      item.quantity = quantity
    }

    // Calculate total
    cart.total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    await cart.save()
    await cart.populate('items.product')

    res.json({ message: 'Cart updated', cart })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Remove from cart
router.delete('/:productId', verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' })
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== req.params.productId)
    cart.total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    await cart.save()

    res.json({ message: 'Item removed', cart })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Clear cart
router.delete('/', verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' })
    }

    cart.items = []
    cart.total = 0

    await cart.save()

    res.json({ message: 'Cart cleared', cart })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

export default router
