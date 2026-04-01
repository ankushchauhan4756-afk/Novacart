import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  LogOut,
  X,
} from 'lucide-react'

export default function AdminSidebar() {
  const navigate = useNavigate()
  const { user, logout } = useStore()
  const [isOpen, setIsOpen] = React.useState(true)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ]

  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-gray-900 text-white transition-all duration-300 flex flex-col overflow-hidden`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {isOpen && <span className="font-bold text-lg">Admin Panel</span>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-gray-800 rounded transition"
        >
          {isOpen ? <X size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* User Info */}
      {isOpen && user && (
        <div className="p-4 bg-gray-800 border-b border-gray-700">
          <p className="font-semibold text-sm">{user.name}</p>
          <p className="text-xs text-gray-400">{user.email}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = window.location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
              title={item.name}
            >
              <Icon size={20} className="flex-shrink-0" />
              {isOpen && <span className="text-sm">{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition"
          title="Logout"
        >
          <LogOut size={20} className="flex-shrink-0" />
          {isOpen && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  )
}
