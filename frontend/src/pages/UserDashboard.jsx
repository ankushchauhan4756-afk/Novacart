import React, { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { useNavigate } from 'react-router-dom'
import { Package, Heart, LogOut, User, MapPin, Clock, CheckCircle, Truck, AlertCircle, Bell } from 'lucide-react'
import { orderService } from '../services/api'

export default function UserDashboard() {
  const { user, logout } = useStore()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('orders')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([])

  if (!user) {
    return navigate('/login')
  }

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders()
    }
  }, [activeTab])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await orderService.getOrders()
      setOrders(response.data?.orders || response.orders || [])
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <Clock size={20} className="text-gray-600" />
      case 'processing':
        return <Clock size={20} className="text-yellow-600" />
      case 'shipped':
        return <Truck size={20} className="text-blue-600" />
      case 'delivered':
        return <CheckCircle size={20} className="text-green-600" />
      default:
        return <AlertCircle size={20} className="text-gray-600" />
    }
  }

  const getStatusColor = (status) => {
    const s = status?.toLowerCase()
    switch (s) {
      case 'pending':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'shipped':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="section-container py-12">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 card-shadow">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-4">
                {user.name[0].toUpperCase()}
              </div>
              <h2 className="font-bold text-lg">{user.name}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
            </div>

            <div className="space-y-2 border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
              {[
                { id: 'orders', label: 'My Orders', icon: Package },
                { id: 'wishlist', label: 'Wishlist', icon: Heart },
                { id: 'profile', label: 'My Profile', icon: User },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                      activeTab === item.id
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="text-sm font-semibold">{item.label}</span>
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => {
                logout()
                navigate('/')
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Orders */}
          {activeTab === 'orders' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 card-shadow">
              <h2 className="text-2xl font-bold mb-6">My Orders</h2>
              
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No orders yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-bold text-lg">{order.orderId || order._id.slice(0, 8)}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₹{order.total?.toLocaleString('en-IN') || 0}</p>
                          <p className="text-xs">{order.items?.length || 0} items</p>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.orderStatus)}`}>
                          {getStatusIcon(order.orderStatus)}
                          <span className="capitalize">{order.orderStatus || 'unknown'}</span>
                        </div>
                      </div>
                      
                      {/* Order Status Timeline */}
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between text-xs">
                          <div className={`flex flex-col items-center ${['pending', 'processing', 'shipped', 'delivered'].indexOf(order.orderStatus?.toLowerCase()) >= 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                            <AlertCircle size={16} />
                            <span className="mt-1">Pending</span>
                          </div>
                          <div className="flex-1 h-0.5 mx-1 bg-gray-300"></div>
                          <div className={`flex flex-col items-center ${['processing', 'shipped', 'delivered'].indexOf(order.orderStatus?.toLowerCase()) >= 0 ? 'text-yellow-600' : 'text-gray-400'}`}>
                            <Clock size={16} />
                            <span className="mt-1">Processing</span>
                          </div>
                          <div className="flex-1 h-0.5 mx-1 bg-gray-300"></div>
                          <div className={`flex flex-col items-center ${['shipped', 'delivered'].indexOf(order.orderStatus?.toLowerCase()) >= 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                            <Truck size={16} />
                            <span className="mt-1">Shipped</span>
                          </div>
                          <div className="flex-1 h-0.5 mx-1 bg-gray-300"></div>
                          <div className={`flex flex-col items-center ${order.orderStatus?.toLowerCase() === 'delivered' ? 'text-green-600' : 'text-gray-400'}`}>
                            <CheckCircle size={16} />
                            <span className="mt-1">Delivered</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Wishlist */}
          {activeTab === 'wishlist' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 card-shadow">
              <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
              <div className="text-center py-12">
                <Heart size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Your wishlist is empty</p>
              </div>
            </div>
          )}

          {/* Profile */}
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 card-shadow">
              <h2 className="text-2xl font-bold mb-6">My Profile</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Name</label>
                  <input
                    type="text"
                    defaultValue={user.name}
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue={user.email}
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full btn-primary"
                >
                  Save Changes
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
