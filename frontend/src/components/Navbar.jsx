import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Heart, Menu, X, Moon, Sun, Search, LogOut } from 'lucide-react'
import { useStore } from '../store/useStore'

export default function Navbar({ onMenuClick, menuOpen }) {
  const navigate = useNavigate()
  const { user, logout, isDarkMode, toggleDarkMode, getCartCount, searchQuery, setSearchQuery } = useStore()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const cartCount = getCartCount()

  const handleLogout = () => {
    logout()
    setIsProfileOpen(false)
    navigate('/')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/?search=${searchQuery}`)
      setIsSearchOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-md">
      <div className="section-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg group-hover:shadow-lg transition-shadow">
              NC
            </div>
            <span className="hidden sm:inline font-bold text-xl gradient-text">NovaCart</span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary-600"
                >
                  <Search size={18} />
                </button>
              </div>
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Search Mobile */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
            >
              <Search size={20} />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Wishlist */}
            <Link
              to="/"
              className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition hidden sm:block"
              title="Wishlist"
            >
              <Heart size={20} />
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Admin Panel Button */}
            {user?.isAdmin && (
              <Link
                to="/admin"
                className="hidden sm:block px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition text-sm"
              >
                Admin Panel
              </Link>
            )}

            {/* Profile */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full flex items-center justify-center font-bold hover:shadow-lg transition"
              >
                {user ? user.name[0].toUpperCase() : 'G'}
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700">
                  {user ? (
                    <>
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <p className="font-semibold text-sm">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        My Dashboard
                      </Link>
                      {user.isAdmin && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 flex items-center gap-2"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <form onSubmit={handleSearch} className="pb-4 md:hidden">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary-600"
              >
                <Search size={18} />
              </button>
            </div>
          </form>
        )}
      </div>
    </header>
  )
}
