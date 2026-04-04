import axios from 'axios'

const API_BASE = import.meta.env.DEV ? '/api' : 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE,
})

console.log('[API] Base URL:', API_BASE)

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  console.log('[API] Token from localStorage:', token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    console.log('[API] Set Authorization header:', config.headers.Authorization)
  } else {
    console.log('[API] No token found in localStorage')
  }
  return config
}, (error) => {
  console.error('[API] Request interceptor error:', error)
  return Promise.reject(error)
})

// Response error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API] Response error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// Auth Service
export const authService = {
  register: async (userData) => {
    const { data } = await api.post('/auth/register', userData)
    if (data.token) {
      localStorage.setItem('token', data.token)
    }
    return data
  },

  login: async (credentials) => {
    const { data } = await api.post('/auth/login', credentials)
    if (data.token) {
      localStorage.setItem('token', data.token)
    }
    return data
  },

  verify: async () => {
    const { data } = await api.get('/auth/verify')
    return data
  },

  logout: async () => {
    localStorage.removeItem('token')
    return await api.post('/auth/logout')
  },

  updateProfile: async (userData) => {
    const { data } = await api.put('/auth/profile', userData)
    return data
  },
}

// Product Service
export const productService = {
  getProducts: async (filters = {}) => {
    const { data } = await api.get('/products', { params: filters })
    return data
  },

  getProductById: async (id) => {
    const { data } = await api.get(`/products/${id}`)
    return data
  },

  searchProducts: async (query) => {
    const { data } = await api.get('/products/search', { params: { q: query } })
    return data
  },

  getProductsByCategory: async (category) => {
    const { data } = await api.get(`/products/category/${category}`)
    return data
  },

  getTrendingProducts: async () => {
    const { data } = await api.get('/products/trending')
    return data
  },

  getRecommendations: async () => {
    const { data } = await api.get('/products/recommendations')
    return data
  },
}

// Category Service
export const categoryService = {
  getCategories: async () => {
    const { data } = await api.get('/categories')
    return data
  },

  getCategoryById: async (id) => {
    const { data } = await api.get(`/categories/${id}`)
    return data
  },
}

// Cart Service
export const cartService = {
  getCart: async () => {
    const { data } = await api.get('/cart')
    return data
  },

  addToCart: async (productId, quantity) => {
    const { data } = await api.post('/cart', { productId, quantity })
    return data
  },

  removeFromCart: async (productId) => {
    const { data } = await api.delete(`/cart/${productId}`)
    return data
  },

  updateCart: async (productId, quantity) => {
    const { data } = await api.put(`/cart/${productId}`, { quantity })
    return data
  },

  clearCart: async () => {
    const { data } = await api.delete('/cart')
    return data
  },
}

// Order Service
export const orderService = {
  createOrder: async (orderData) => {
    const { data } = await api.post('/orders', orderData)
    return data
  },

  getOrders: async () => {
    const { data } = await api.get('/orders')
    return data
  },

  getAllOrders: async () => {
    const { data } = await api.get('/admin/orders')
    return data
  },

  getOrderById: async (id) => {
    const { data } = await api.get(`/orders/${id}`)
    return data
  },

  updateOrder: async (id, updates) => {
    const { data } = await api.put(`/orders/${id}`, updates)
    return data
  },

  updateOrderStatus: async (id, status) => {
    const { data } = await api.patch(`/admin/orders/${id}/status`, { status })
    return data
  },

  assignDeliveryBoy: async (orderId, deliveryBoyId) => {
    const { data } = await api.patch(`/admin/orders/${orderId}/assign-delivery-boy`, { deliveryBoyId })
    return data
  },

  getDeliveryBoys: async () => {
    const { data } = await api.get('/admin/delivery-boys')
    return data
  },

  cancelOrder: async (id) => {
    const { data } = await api.post(`/orders/${id}/cancel`)
    return data
  },
}

// Payment Service
export const paymentService = {
  createOrder: async (amount, currency = 'INR', receipt) => {
    const { data } = await api.post('/payments/create-order', { amount, currency, receipt })
    return data
  },

  verifyPayment: async (paymentData) => {
    const { data } = await api.post('/payments/verify', paymentData)
    return data
  },

  getPaymentStatus: async (paymentId) => {
    const { data } = await api.get(`/payments/${paymentId}`)
    return data
  },
}

// Review Service
export const reviewService = {
  getProductReviews: async (productId) => {
    const { data } = await api.get(`/reviews/product/${productId}`)
    return data
  },

  createReview: async (productId, reviewData) => {
    const { data } = await api.post('/reviews', { productId, ...reviewData })
    return data
  },

  updateReview: async (reviewId, reviewData) => {
    const { data } = await api.put(`/reviews/${reviewId}`, reviewData)
    return data
  },

  deleteReview: async (reviewId) => {
    const { data } = await api.delete(`/reviews/${reviewId}`)
    return data
  },
}

// Coupon Service
export const couponService = {
  validateCoupon: async (code) => {
    const { data } = await api.post('/coupons/validate', { code })
    return data
  },

  getCoupon: async (code) => {
    const { data } = await api.get(`/coupons/${code}`)
    return data
  },
}

// Admin Service
export const adminService = {
  getDashboardStats: async () => {
    const { data } = await api.get('/admin/stats')
    return data
  },

  // Products
  getAdminProducts: async (filters = {}) => {
    const { data } = await api.get('/admin/products', { params: filters })
    return data
  },

  createProduct: async (productData) => {
    const { data } = await api.post('/admin/products', productData)
    return data
  },

  updateProduct: async (id, productData) => {
    const { data } = await api.put(`/admin/products/${id}`, productData)
    return data
  },

  deleteProduct: async (id) => {
    const { data } = await api.delete(`/admin/products/${id}`)
    return data
  },

  // Orders
  getAdminOrders: async (filters = {}) => {
    const { data } = await api.get('/admin/orders', { params: filters })
    return data
  },

  updateOrderStatus: async (id, status) => {
    const { data } = await api.put(`/admin/orders/${id}/status`, { status })
    return data
  },

  // Categories
  createCategory: async (categoryData) => {
    const { data } = await api.post('/admin/categories', categoryData)
    return data
  },

  updateCategory: async (id, categoryData) => {
    const { data } = await api.put(`/admin/categories/${id}`, categoryData)
    return data
  },

  deleteCategory: async (id) => {
    const { data } = await api.delete(`/admin/categories/${id}`)
    return data
  },

  // Users
  getAdminUsers: async (filters = {}) => {
    const { data } = await api.get('/admin/users', { params: filters })
    return data
  },
}

export default api
