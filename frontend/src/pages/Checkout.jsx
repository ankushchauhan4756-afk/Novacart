import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { orderService, paymentService } from '../services/api'
import { formatPrice } from '../utils/helpers'
import { ChevronDown, MapPin, Phone, Mail, Loader } from 'lucide-react'

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
    paymentMethod: 'razorpay',
  })

  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [paymentError, setPaymentError] = useState(null)
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

    setIsProcessingPayment(true)
    setPaymentError(null)

    try {
      // Calculate total amount
      const total = getCartTotal()

      // Create order data for payment verification
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

      // Create Razorpay order
      const paymentResponse = await paymentService.createOrder(total, 'INR', `order_${Date.now()}`)

      if (!paymentResponse.success) {
        throw new Error(paymentResponse.message || 'Failed to create payment order')
      }

      const { order, keyId, mock } = paymentResponse

      if (mock) {
        const verifyResponse = await paymentService.verifyPayment({
          razorpay_order_id: order.id,
          razorpay_payment_id: `mock_payment_${Date.now()}`,
          razorpay_signature: 'mock_signature',
          orderData,
          mock: true,
        })

        if (verifyResponse.success) {
          clearCart()
          navigate(`/order-success/${verifyResponse.order.orderId}`, {
            state: {
              order: {
                id: verifyResponse.order.orderId,
                total: verifyResponse.order.total,
                items: verifyResponse.order.items.length,
                date: verifyResponse.order.createdAt,
                status: verifyResponse.order.orderStatus,
                address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.pincode}`,
              },
            },
          })
          return
        }

        throw new Error(verifyResponse.message || 'Mock payment verification failed')
      }

      if (!window.Razorpay) {
        throw new Error('Razorpay checkout script not loaded. Please refresh the page.')
      }

      // Initialize Razorpay checkout
      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'NovaCart',
        description: 'Purchase from NovaCart',
        order_id: order.id,
        handler: async function (response) {
          try {
            console.log('Razorpay payment successful! Response:', response)
            // Verify payment on backend
            const verifyResponse = await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderData: orderData,
            })

            console.log('Backend verify response:', verifyResponse)

            if (verifyResponse.success) {
              console.log('Order created successfully! Order ID:', verifyResponse.order.orderId)
              // Clear cart and redirect to success
              clearCart()
              navigate(`/order-success/${verifyResponse.order.orderId}`, {
                state: {
                  order: {
                    id: verifyResponse.order.orderId,
                    total: verifyResponse.order.total,
                    items: verifyResponse.order.items.length,
                    date: verifyResponse.order.createdAt,
                    status: verifyResponse.order.orderStatus,
                    address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.pincode}`,
                  },
                },
              })
            } else {
              console.log('Verification failed:', verifyResponse.message)
              setPaymentError('Payment verification failed. Please contact support.')
            }
          } catch (error) {
            console.error('Payment verification error:', error)
            console.error('Error response:', error.response?.data)
            setPaymentError('Payment verification failed. Please try again.')
          } finally {
            setIsProcessingPayment(false)
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#3B82F6', // Primary blue color
        },
        modal: {
          ondismiss: function() {
            setIsProcessingPayment(false)
            setPaymentError('Payment was cancelled.')
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()

    } catch (error) {
      console.error('Payment initiation error:', error)
      const backendMessage = error.response?.data?.message || error.response?.data?.error
      setPaymentError(backendMessage || error.message || 'Failed to initiate payment')
      setIsProcessingPayment(false)
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
            {[1, 2].map((s) => (
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
                {s < 2 && (
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
                Continue to Review
              </button>
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
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
                  onClick={() => setStep(1)}
                  className="flex-1 btn-secondary"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessingPayment}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessingPayment ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader size={20} className="animate-spin" />
                      Processing Payment...
                    </div>
                  ) : (
                    'Place Order & Pay'
                  )}
                </button>
              </div>

              {paymentError && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-600 dark:text-red-400 text-sm">{paymentError}</p>
                </div>
              )}
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
