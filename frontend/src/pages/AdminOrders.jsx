import React, { useState, useEffect } from 'react'
import { CheckCircle, Truck, Clock, AlertCircle, Bell, User } from 'lucide-react'
import { orderService } from '../services/api'
import { useStore } from '../store/useStore'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [deliveryBoys, setDeliveryBoys] = useState([])
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [fetchError, setFetchError] = useState('')
  const [statusUpdating, setStatusUpdating] = useState(false)
  const { user } = useStore()

  const statusStages = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']

  useEffect(() => {
    fetchOrders()
    fetchDeliveryBoys()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setFetchError('')
      console.log('Fetching orders from /admin/orders...')
      const response = await orderService.getAllOrders()
      console.log('Full response received:', response)
      console.log('Response.orders:', response.orders)
      console.log('Orders array length:', response.orders?.length)
      setOrders(response.orders || [])
      if (!response.orders || response.orders.length === 0) {
        setFetchError('No orders found. Please ensure orders are created in the database.')
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      console.error('Error details:', error.response?.data)
      setFetchError(error.response?.data?.message || 'Failed to load orders')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const fetchDeliveryBoys = async () => {
    try {
      const response = await orderService.getDeliveryBoys()
      setDeliveryBoys(response.deliveryBoys || [])
    } catch (error) {
      console.error('Failed to fetch delivery boys:', error)
      setDeliveryBoys([])
    }
  }

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setStatusUpdating(true)
      await orderService.updateOrderStatus(orderId, newStatus)
      showNotification(`Order updated to ${newStatus}`, 'success')
      await fetchOrders()
      setSelectedOrder(null)
    } catch (error) {
      console.error('Failed to update order:', error)
      showNotification('Failed to update order', 'error')
    } finally {
      setStatusUpdating(false)
    }
  }

  const handleAssignDeliveryBoy = async (orderId, deliveryBoyId) => {
    try {
      if (!deliveryBoyId) {
        showNotification('Please select a delivery boy', 'error')
        return
      }
      await orderService.assignDeliveryBoy(orderId, deliveryBoyId)
      showNotification('Delivery boy assigned successfully', 'success')
      fetchOrders()
      setSelectedOrder(null)
      setSelectedDeliveryBoy(null)
    } catch (error) {
      console.error('Failed to assign delivery boy:', error)
      showNotification('Failed to assign delivery boy', 'error')
    }
  }

  const showNotification = (message, type = 'success') => {
    const notification = { id: Date.now(), message, type }
    setNotifications([notification, ...notifications])
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id))
    }, 3000)
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <Clock size={18} className="text-gray-600" />
      case 'confirmed':
        return <CheckCircle size={18} className="text-yellow-600" />
      case 'processing':
        return <Clock size={18} className="text-blue-600" />
      case 'shipped':
        return <Truck size={18} className="text-blue-600" />
      case 'delivered':
        return <CheckCircle size={18} className="text-green-600" />
      default:
        return <AlertCircle size={18} className="text-gray-600" />
    }
  }

  const getStatusColor = (status) => {
    const s = status?.toLowerCase()
    switch (s) {
      case 'pending':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
      case 'confirmed':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'shipped':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getNextStatuses = (currentStatus) => {
    const currentIndex = statusStages.findIndex(
      s => s === currentStatus?.toLowerCase()
    )
    return statusStages.slice(currentIndex + 1)
  }

  if (!user?.isAdmin) {
    return (
      <div className="section-container py-12">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <AlertCircle size={32} className="mx-auto mb-4 text-red-600" />
          <h2 className="text-xl font-bold text-red-600 mb-2">Access Denied</h2>
          <p className="text-red-600">
            You must be an admin to access this page.
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="section-container py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading orders...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="section-container py-12">
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2">
          {notifications.map(notif => (
            <div
              key={notif.id}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white ${
                notif.type === 'success' ? 'bg-green-600' : 'bg-red-600'
              }`}
            >
              <Bell size={18} />
              <span>{notif.message}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Order Management</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage and track customer orders, accept orders and assign to delivery
          boys
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
          <p className="text-2xl font-bold mt-2">{orders.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
          <p className="text-2xl font-bold text-gray-600 mt-2">
            {
              orders.filter(o => o.orderStatus?.toLowerCase() === 'pending')
                .length
            }
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Shipped</p>
          <p className="text-2xl font-bold text-blue-600 mt-2">
            {
              orders.filter(o => o.orderStatus?.toLowerCase() === 'shipped')
                .length
            }
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Delivered</p>
          <p className="text-2xl font-bold text-green-600 mt-2">
            {
              orders.filter(o => o.orderStatus?.toLowerCase() === 'delivered')
                .length
            }
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-12 text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400">
            {fetchError || 'No orders found'}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Delivery Boy
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {orders.map(order => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                  >
                    <td className="px-6 py-4 text-sm font-semibold">
                      {order.orderId || order._id?.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div>
                        <p className="font-semibold">{order.user?.name || 'N/A'}</p>
                        <p className="text-xs text-gray-500">
                          {order.user?.email || 'N/A'}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold">
                      ₹{order.total?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div
                        className={`flex items-center gap-2 w-fit px-2 py-1 rounded-full ${getStatusColor(
                          order.orderStatus
                        )}`}
                      >
                        {getStatusIcon(order.orderStatus)}
                        <span className="capitalize text-xs font-semibold">
                          {order.orderStatus || 'unknown'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {order.deliveryBoy ? (
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-primary-600" />
                          <span className="font-semibold">
                            {order.deliveryBoy.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-500 italic">Not assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-primary-600 hover:text-primary-700 font-semibold"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 max-h-96 overflow-y-auto">
            <h3 className="text-xl font-bold mb-6">Manage Order</h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Order ID
                </p>
                <p className="font-semibold">
                  {selectedOrder.orderId || selectedOrder._id?.slice(0, 8)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Customer
                </p>
                <p className="font-semibold">{selectedOrder.user?.name}</p>
              </div>
            </div>

            <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Current Status
              </p>
              <div
                className={`flex items-center gap-2 w-fit px-3 py-2 rounded-lg ${getStatusColor(
                  selectedOrder.orderStatus
                )}`}
              >
                {getStatusIcon(selectedOrder.orderStatus)}
                <span className="capitalize font-semibold">
                  {selectedOrder.orderStatus}
                </span>
              </div>
            </div>

            {getNextStatuses(selectedOrder.orderStatus).length > 0 && (
              <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Update Status
                </p>
                <div className="space-y-2">
                  {getNextStatuses(selectedOrder.orderStatus).map(status => (
                    <button
                      key={status}
                            type="button"
                            onClick={() =>
                              handleStatusUpdate(selectedOrder._id, status)
                            }
                            disabled={statusUpdating}
                            className={`w-full px-4 py-2 text-left rounded-lg capitalize font-semibold transition ${statusUpdating ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                          >
                            {statusUpdating ? 'Updating...' : status}
              </p>
              <div className="space-y-2">
                <select
                  value={selectedDeliveryBoy || ''}
                  onChange={e => setSelectedDeliveryBoy(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-600"
                >
                  <option value="">Select a delivery boy</option>
                  {deliveryBoys.map(boy => (
                    <option key={boy._id} value={boy._id}>
                      {boy.name} - {boy.phone}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() =>
                    handleAssignDeliveryBoy(
                      selectedOrder._id,
                      selectedDeliveryBoy
                    )
                  }
                  className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition"
                >
                  Assign Delivery Boy
                </button>
              </div>
              {selectedOrder.deliveryBoy && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    <strong>Currently assigned:</strong>{' '}
                    {selectedOrder.deliveryBoy.name} ({selectedOrder.deliveryBoy.phone})
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-semibold transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
