import express from 'express'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = express.Router()

// Dummy token for testing
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body

    // Check if user exists
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(password, salt)

    // Create user
    user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
    })

    await user.save()

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    // Check password
    const isMatch = await bcryptjs.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Verify Token
router.get('/verify', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    // Allow mock tokens in development
    if (process.env.NODE_ENV === 'development' && token.startsWith('mock-token-')) {
      console.log('[AUTH] Verifying mock token')
      const isMockAdmin = token === 'mock-token-admin'
      const user = {
        id: isMockAdmin ? '1' : '2',
        email: isMockAdmin ? 'admin@novacart.com' : 'user@novacart.com',
        isAdmin: isMockAdmin,
        name: isMockAdmin ? 'Admin User' : 'John Doe'
      }
      return res.json({ valid: true, user })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    res.json({ valid: true, user: decoded })
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
})

// Logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' })
})

// Get Profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(decoded.id).select('-password')

    res.json(user)
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' })
  }
})

// Update Profile
router.put('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await User.findByIdAndUpdate(
      decoded.id,
      req.body,
      { new: true }
    ).select('-password')

    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

export default router
