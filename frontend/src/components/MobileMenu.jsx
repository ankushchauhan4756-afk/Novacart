import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { X, LogOut } from 'lucide-react'

const CATEGORIES = [
  { name: 'Fashion', path: '/category/fashion' },
  { name: 'Clothes', path: '/category/clothes' },
  { name: 'Tech Gadgets', path: '/category/tech-gadgets' },
  { name: 'Fruits', path: '/category/fruits' },
  { name: 'Vegetables', path: '/category/vegetables' },
]

export default function MobileMenu({ isOpen, onClose }) {
  const navigate = useNavigate()
  const { user, logout } = useStore()

  const handleLogout = () => {
    logout()
    navigate('/')
    onClose()
  }

  const handleNavigate = (path) => {
    navigate(path)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-40 md:hidden"
      onClick={onClose}
    >
      <div
        className="absolute inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-transform"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
          <span className="font-bold gradient-text text-lg">Menu</span>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(100vh-70px)]">
          {/* User Info */}
          {user && (
            <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-100 dark:border-gray-600">
              <p className="font-semibold text-sm">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          )}

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            <Link
              to="/"
              onClick={() => handleNavigate('/')}
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
            >
              Home
            </Link>

            {/* Categories */}
            <div>
              <p className="px-4 py-2 font-semibold text-sm text-gray-700 dark:text-gray-300">
                Categories
              </p>
              {CATEGORIES.map((category) => (
                <Link
                  key={category.path}
                  to={category.path}
                  onClick={() => handleNavigate(category.path)}
                  className="block px-8 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                >
                  {category.name}
                </Link>
              ))}
            </div>

            {/* Auth Links */}
            {!user && (
              <>
                <Link
                  to="/login"
                  onClick={() => handleNavigate('/login')}
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => handleNavigate('/register')}
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                >
                  Register
                </Link>
              </>
            )}

            {user && (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => handleNavigate('/dashboard')}
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                >
                  My Dashboard
                </Link>
                {user.isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => handleNavigate('/admin')}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition text-primary-600"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-red-600 flex items-center gap-2 transition"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </div>
  )
}
