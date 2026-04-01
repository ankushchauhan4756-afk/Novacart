import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const { setUser, setToken } = useStore()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Mock login
      if (formData.email === 'admin@novacart.com' && formData.password === 'admin123') {
        const mockUser = {
          id: '1',
          name: 'Admin User',
          email: formData.email,
          isAdmin: true,
        }
        const token = 'mock-token-admin'
        setUser(mockUser)
        setToken(token)
        localStorage.setItem('token', token)
        navigate('/admin')
      } else if (formData.email && formData.password) {
        const mockUser = {
          id: '2',
          name: 'John Doe',
          email: formData.email,
          isAdmin: false,
        }
        const token = 'mock-token-user'
        setUser(mockUser)
        setToken(token)
        localStorage.setItem('token', token)
        navigate('/')
      } else {
        setError('Please enter valid credentials')
      }
    } catch (error) {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
              NC
            </div>
            <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
            <p className="text-gray-600 dark:text-gray-400">Sign in to your account</p>
          </div>

          {/* Demo Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6 text-sm">
            <p className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Demo Credentials:</p>
            <p className="text-blue-800 dark:text-blue-200">User: user@novacart.com</p>
            <p className="text-blue-800 dark:text-blue-200">Admin: admin@novacart.com / admin123</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-2">Email Address</label>
              <div className="relative">
                <Mail size={20} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold mb-2">Password</label>
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded" />
                <span>Remember me</span>
              </label>
              <a href="#" className="text-primary-600 hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                New user?
              </span>
            </div>
          </div>

          {/* Register Link */}
          <Link
            to="/register"
            className="w-full btn-secondary text-center"
          >
            Create New Account
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-white/80 text-sm mt-6">
          By signing in, you agree to our Terms and Conditions
        </p>
      </div>
    </div>
  )
}
