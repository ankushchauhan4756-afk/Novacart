import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart3, Users, Package, ShoppingCart } from 'lucide-react'

export default function AdminDashboard() {
  const navigate = useNavigate()

  const stats = [
    { label: 'Total Sales', value: '₹2,45,890', icon: ShoppingCart, color: 'bg-blue-100' },
    { label: 'Total Orders', value: '1,234', icon: Package, color: 'bg-purple-100' },
    { label: 'Total Users', value: '5,678', icon: Users, color: 'bg-pink-100' },
    { label: 'Revenue', value: '₹89,234', icon: BarChart3, color: 'bg-green-100' },
  ]

  const recentOrders = [
    { id: 'ORD-001', customer: 'John Doe', amount: '₹2,999', status: 'Pending' },
    { id: 'ORD-002', customer: 'Jane Smith', amount: '₹5,999', status: 'Shipped' },
    { id: 'ORD-003', customer: 'Admin User', amount: '₹4,999', status: 'Delivered' },
  ]

  return (
    <div className="p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg p-6 card-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} dark:bg-opacity-20 w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="text-2xl" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 card-shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Recent Orders</h2>
          <button
            onClick={() => navigate('/admin/orders')}
            className="text-primary-600 hover:underline text-sm font-semibold"
          >
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left px-4 py-3 font-bold">Order ID</th>
                <th className="text-left px-4 py-3 font-bold">Customer</th>
                <th className="text-left px-4 py-3 font-bold">Amount</th>
                <th className="text-left px-4 py-3 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3 font-semibold">{order.id}</td>
                  <td className="px-4 py-3">{order.customer}</td>
                  <td className="px-4 py-3">{order.amount}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'Pending'
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600'
                          : order.status === 'Shipped'
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                          : 'bg-green-100 dark:bg-green-900/30 text-green-600'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
