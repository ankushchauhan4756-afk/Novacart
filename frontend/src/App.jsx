import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './store/useStore'
import './index.css'

// Layouts
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'

// Pages
import Home from './pages/Home'
import Category from './pages/Category'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Login from './pages/Login'
import Register from './pages/Register'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'
import AdminProducts from './pages/AdminProducts'
import AdminOrders from './pages/AdminOrders'
import NotFound from './pages/NotFound'

function App() {
  const { isDarkMode, toggleDarkMode, user } = useStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize app
    const initializeApp = async () => {
      try {
        // Check if user is logged in
        const token = localStorage.getItem('token')
        if (token) {
          // Validate token with backend - allow mock tokens in development
          if (token.startsWith('mock-token-')) {
            console.log('Using mock token')
          } else {
            const response = await fetch('http://localhost:5000/auth/verify', {
              headers: { Authorization: `Bearer ${token}` }
            })
            if (!response.ok) {
              localStorage.removeItem('token')
            }
          }
        }
      } catch (error) {
        console.error('App initialization error:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeApp()
  }, [])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading NovaCart...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        {/* Main App Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/category/:category" element={<Category />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={user ? <Checkout /> : <Navigate to="/login" />} />
          <Route path="/order-success/:orderId" element={user ? <OrderSuccess /> : <Navigate to="/" />} />
          <Route path="/dashboard" element={user && !user.isAdmin ? <UserDashboard /> : <Navigate to="/" />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={user?.isAdmin ? <AdminDashboard /> : <Navigate to="/" />} />
          <Route path="/admin/products" element={user?.isAdmin ? <AdminProducts /> : <Navigate to="/" />} />
          <Route path="/admin/orders" element={user?.isAdmin ? <AdminOrders /> : <Navigate to="/" />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
