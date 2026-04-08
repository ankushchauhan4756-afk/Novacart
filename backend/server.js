import express from 'express'
import cors from 'cors'
import path from 'path'
import http from 'http'
import { Server } from 'socket.io'
import { fileURLToPath } from 'url'
import { config } from './config/config.js'
import { connectDB } from './config/database.js'
import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'
import orderRoutes from './routes/orders.js'
import cartRoutes from './routes/cart.js'
import reviewRoutes from './routes/reviews.js'
import couponRoutes from './routes/coupons.js'
import categoryRoutes from './routes/categories.js'
import paymentRoutes from './routes/payments.js'
import adminRoutes from './routes/admin.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

const allowedOrigins = Array.isArray(config.CORS_ORIGIN)
  ? config.CORS_ORIGIN
  : [config.CORS_ORIGIN]

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }
      callback(new Error(`CORS origin denied: ${origin}`))
    },
    credentials: true,
  })
)

// Serve static files
app.use('/public', express.static(path.join(__dirname, '../frontend/public')))
app.use('/images', express.static(path.join(__dirname, '../frontend/public/images')))

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' })
})

// API Routes
app.use('/auth', authRoutes)
app.use('/products', productRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', orderRoutes)
app.use('/reviews', reviewRoutes)
app.use('/coupons', couponRoutes)
app.use('/categories', categoryRoutes)
app.use('/payments', paymentRoutes)
app.use('/admin', adminRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    error: config.NODE_ENV === 'development' ? err : {},
  })
})

// Start server
const PORT = config.PORT
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: config.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'PATCH'],
    credentials: true,
  },
})

app.set('io', io)

io.on('connection', (socket) => {
  console.log('[Socket] connected', socket.id)

  socket.on('joinUser', ({ userId }) => {
    if (userId) {
      const room = `user_${userId}`
      socket.join(room)
      console.log(`[Socket] user joined room: ${room}`)
    }
  })

  socket.on('disconnect', () => {
    console.log('[Socket] disconnected', socket.id)
  })
})

async function start() {
  try {
    await connectDB()
    
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
      console.log(`Environment: ${config.NODE_ENV}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

start()
