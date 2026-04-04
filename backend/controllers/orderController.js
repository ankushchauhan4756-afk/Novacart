import nodemailer from 'nodemailer'
import Order from '../models/Order.js'
import User from '../models/User.js'
import { config } from '../config/config.js'

const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

const statusLocations = {
  pending: 'Order received',
  confirmed: 'Payment confirmed',
  processing: 'Warehouse',
  shipped: 'Out for delivery',
  delivered: 'Delivered at destination',
  cancelled: 'Order cancelled',
}

const getTrackingLocation = (status) => statusLocations[status] || 'In transit'

const createTransporter = () => {
  if (!config.EMAIL_HOST || !config.EMAIL_USER || !config.EMAIL_PASS) {
    console.warn('Email configuration is missing. Email notifications will be skipped.')
    return null
  }

  return nodemailer.createTransport({
    host: config.EMAIL_HOST,
    port: parseInt(config.EMAIL_PORT, 10) || 587,
    secure: false,
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASS,
    },
  })
}

const transporter = createTransporter()

const sendOrderStatusEmail = async (user, order, status) => {
  if (!transporter || !user?.email) return

  const subject = `NovaCart Order ${order.orderId} status updated to ${status}`
  const body = `Hello ${user.name || 'Customer'},\n\nYour order ${order.orderId} status has been updated to ${status}.\n\nCurrent tracking details:\n${order.trackingHistory.map((item) => `- ${item.status} | ${item.location || 'Unknown location'} | ${new Date(item.timestamp).toLocaleString()}`).join('\n')}\n\nThank you for shopping with NovaCart!`

  try {
    await transporter.sendMail({
      from: config.EMAIL_USER,
      to: user.email,
      subject,
      text: body,
    })
    console.log('Order status email sent to', user.email)
  } catch (error) {
    console.error('Failed to send order status email:', error.message)
  }
}

export const updateOrderStatus = async (req, res) => {
  try {
    const { status, location } = req.body
    const orderId = req.params.id

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }

    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' })
    }

    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    const trackingEntry = {
      status,
      location: location || getTrackingLocation(status),
      timestamp: new Date(),
    }

    order.orderStatus = status
    order.statusHistory.push({ status, timestamp: new Date() })
    order.trackingHistory.push(trackingEntry)

    const savedOrder = await order.save()
    await savedOrder.populate('user', 'name email phone')
    await savedOrder.populate('deliveryBoy', 'name email phone')

    const io = req.app.get('io')
    const room = order.user ? `user_${order.user.toString()}` : null
    if (io && room) {
      io.to(room).emit('orderStatusUpdated', {
        orderId: savedOrder.orderId,
        status: savedOrder.orderStatus,
        trackingHistory: savedOrder.trackingHistory,
        order: savedOrder,
      })
    }

    if (['shipped', 'delivered'].includes(status) && savedOrder.user) {
      const user = await User.findById(order.user).select('name email')
      await sendOrderStatusEmail(user, savedOrder, status)
    }

    res.json({
      message: 'Order status updated successfully',
      order: savedOrder,
    })
  } catch (error) {
    console.error('Order status update error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}
