import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CheckCircle, Package, Clock, MapPin, Phone, Home } from 'lucide-react'

export default function OrderSuccess() {
  const navigate = useNavigate()
  const { orderId } = useParams()

  const order = {
    id: orderId,
    total: 14998,
    items: 8,
    date: new Date().toISOString(),
    status: 'Processing',
    address: '123 Sample Lane, City, State 123456',
    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
  }

  return (
    <div className="section-container py-20">
      <div className="max-w-2xl mx-auto">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={60} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Thank you for your order. Your order is being processed.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 card-shadow mb-8">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-1">
                Order Number
              </p>
              <p className="text-2xl font-bold text-primary-600">{order.id}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-1">
                Order Date
              </p>
              <p className="text-lg font-bold">
                {new Date(order.date).toLocaleDateString('en-IN')}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-1">
                Total Amount
              </p>
              <p className="text-2xl font-bold">₹{order.total.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-1">
                Number of Items
              </p>
              <p className="text-lg font-bold">{order.items} items</p>
            </div>
          </div>

          {/* Order Status */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <p className="font-bold mb-4">Order Status</p>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <Clock size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="font-semibold">Processing</p>
                  <p className="text-xs text-gray-500">Today</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your order is being prepared for shipment. You'll receive a tracking number soon via email.
            </p>
          </div>

          {/* Shipping Address */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-8">
            <p className="font-bold mb-4 flex items-center gap-2">
              <MapPin size={20} /> Shipping Address
            </p>
            <p className="text-gray-600 dark:text-gray-400">{order.address}</p>
            <p className="text-sm text-gray-500 mt-2">
              Expected delivery: {order.estimatedDelivery}
            </p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8 border border-blue-200 dark:border-blue-800">
          <h3 className="font-bold mb-4">What's Next?</h3>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex gap-2">
              <span className="text-primary-600 font-bold">1.</span>
              <span>Check your email for order confirmation</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary-600 font-bold">2.</span>
              <span>Your order will be shipped within 24-48 hours</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary-600 font-bold">3.</span>
              <span>Track your order from your dashboard</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary-600 font-bold">4.</span>
              <span>Receive your package with care</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 btn-primary flex items-center justify-center gap-2"
          >
            <Home size={20} />
            View Orders
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 btn-secondary"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  )
}
