import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { orderService } from '../services/api'
import { formatPrice } from '../utils/helpers'
import { ChevronDown, MapPin, Phone, Mail } from 'lucide-react'

export default function Checkout() {
  const navigate = useNavigate()
  const { user, cart, getCartTotal, clearCart } = useStore()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'card',
  })

  const total = getCartTotal()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePlaceOrder = async () => {
    // Validate form
    if (!formData.firstName || !formData.phone || !formData.address || !formData.city || !formData.pincode) {
      alert('Please fill all required fields')
      return
    }

    try {
      console.log('Token from localStorage:', localStorage.getItem('token'))
      console.log('User from store:', user)
      
      // Create order payload
      const orderData = {
        items: cart.map(item => ({
          product: item.id,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount || 0,
        })),
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        paymentMethod: formData.paymentMethod,
      }

      console.log('Sending order data:', orderData)
      
      // Create order via API
      const response = await orderService.createOrder(orderData)
      
      if (response.order) {
        // Clear cart and redirect to success
        clearCart()
        navigate(`/order-success/${response.order.orderId}`, {
          state: {
            order: {
              id: response.order.orderId,
              total: response.order.total,
              items: response.order.items.length,
              date: response.order.createdAt,
              status: response.order.orderStatus,
              address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.pincode}`,
            },
          },
        })
      }
    } catch (error) {
      console.error('Order creation error:', error)
      console.error('Error details:', error.response?.data || error.message)
      alert(`Failed to place order: ${error.response?.data?.message || error.message}`)
    }
  }

  return (
    <div className="section-container py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          {/* Steps */}
          <div className="flex gap-4 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step >= s
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`h-1 w-8 ${
                      step > s
                        ? 'bg-primary-600'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Shipping */}
          {step === 1 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 card-shadow">
              <h2 className="text-xl font-bold mb-6">Shipping Address</h2>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="10-digit number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Street address"
                    required
                  ></textarea>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="6-digit"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="mt-6 w-full btn-primary"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 card-shadow">
              <h2 className="text-xl font-bold mb-6">Payment Method</h2>
              <div className="space-y-4">
                {['card', 'upi', 'netbanking'].map((method) => (
                  <label key={method} className="flex items-center p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-primary-500 transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={formData.paymentMethod === method}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <p className="font-semibold capitalize">{method === 'card' ? 'Credit/Debit Card' : method === 'upi' ? 'UPI' : 'Net Banking'}</p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="mt-6 space-x-4 flex">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 btn-secondary"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 btn-primary"
                >
                  Review Order
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 card-shadow">
              <h2 className="text-xl font-bold mb-6">Order Review</h2>

              <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <MapPin size={20} /> Shipping Address
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {formData.firstName} {formData.lastName}<br />
                  {formData.address}<br />
                  {formData.city}, {formData.state} {formData.pincode}
                </p>
              </div>

              <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Phone size={20} /> Contact Info
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Email: {formData.email}<br />
                  Phone: {formData.phone}
                </p>
              </div>

              <div className="mt-6 space-x-4 flex">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 btn-secondary"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  className="flex-1 btn-primary"
                >
                  Place Order
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 card-shadow sticky top-20">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700 max-h-64 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {item.name} x {item.quantity}
                  </span>
                  <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-semibold">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                <span className="font-semibold text-green-600">FREE</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-gray-700 pt-3">
                <span>Total</span>
                <span className="text-primary-600">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
