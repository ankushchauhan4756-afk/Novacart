import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react'
import { formatPrice } from '../utils/helpers'

export default function Cart() {
  const navigate = useNavigate()
  const { cart, removeFromCart, updateCartQuantity, clearCart, getCartTotal } = useStore()
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)

  const total = getCartTotal()
  const discountAmount = (total * discount) / 100
  const finalTotal = total - discountAmount

  const handleApplyCoupon = () => {
    // Mock coupon validation
    if (couponCode === 'SAVE10') {
      setDiscount(10)
    } else if (couponCode === 'SAVE20') {
      setDiscount(20)
    } else {
      alert('Invalid coupon code')
      setDiscount(0)
    }
  }

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty')
      return
    }
    navigate('/checkout')
  }

  if (cart.length === 0) {
    return (
      <div className="section-container py-20 text-center">
        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag size={40} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Add some products to your cart to proceed with checkout
        </p>
        <button
          onClick={() => navigate('/')}
          className="btn-primary"
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  return (
    <div className="section-container py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 flex gap-4 card-shadow"
              >
                {/* Image */}
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <p className="text-primary-600 font-bold mt-1">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  {/* Quantity Control */}
                  <div className="flex items-center gap-3 w-max">
                    <button
                      onClick={() =>
                        updateCartQuantity(item.id, Math.max(1, item.quantity - 1))
                      }
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded font-bold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateCartQuantity(item.id, item.quantity + 1)
                      }
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <Plus size={18} />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-4 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="text-right flex flex-col justify-between">
                  <p className="font-bold">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.quantity} × {formatPrice(item.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 card-shadow sticky top-20">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            {/* Coupon */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Coupon Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter coupon"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 bg-primary-600 text-white rounded font-bold hover:bg-primary-700 transition text-sm"
                >
                  Apply
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Try: SAVE10 or SAVE20
              </p>
            </div>

            {/* Summary */}
            <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-semibold">{formatPrice(total)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({discount}%)</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                <span className="font-semibold text-green-600">FREE</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-gray-700 pt-3">
                <span>Total</span>
                <span className="text-primary-600">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full btn-primary flex items-center justify-center gap-2 mb-3"
            >
              Proceed to Checkout <ArrowRight size={20} />
            </button>

            {/* Continue Shopping */}
            <button
              onClick={() => navigate('/')}
              className="w-full btn-secondary"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
