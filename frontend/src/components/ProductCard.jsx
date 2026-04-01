import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { formatPrice, calculateDiscount } from '../utils/helpers'
import { generateProductImage } from '../utils/productImages'
import { Heart, ShoppingCart, Star } from 'lucide-react'

export default function ProductCard({ product }) {
  const navigate = useNavigate()
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore()
  const inWishlist = isInWishlist(product.id)
  const discount = calculateDiscount(product.originalPrice || product.price, product.price)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [useFallback, setUseFallback] = useState(false)

  const handleAddToCart = (e) => {
    e.stopPropagation()
    addToCart({ ...product, quantity: 1 })
    // Show toast notification
  }

  const handleWishlist = (e) => {
    e.stopPropagation()
    if (inWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
    setImageError(false)
  }

  const handleImageError = () => {
    setImageError(true)
    setUseFallback(true)
  }

  // Map product names to local downloaded images
  const productImageMap = {
    'Premium Wireless Headphones': '/images/products/headphones.webp',
    'Cotton T-Shirt': '/images/products/tshirt.avif',
    'Stylish Sunglasses': '/images/products/sunglasses.jpg',
    'Fresh Apples - 1kg': '/images/products/apples.jpg',
    'Smart Watch Pro': '/images/products/watch.webp',
    'Designer Handbag': '/images/products/handbag.jpg',
    'Blue Denim Jeans': '/images/products/jeans.webp',
    'Organic Bananas - 1kg': '/images/products/bananas.jpg',
    'Fresh Carrots - 1kg': '/images/products/carrots.png',
    'Wireless Keyboard': '/images/products/keyboard.jpg',
  };

  // Get image URL with smart fallback logic
  const getImageUrl = () => {
    if (useFallback) {
      // Use exact match or generic Unsplash image
      return productImageMap[product.name] || generateProductImage(product.name);
    }

    if (product.image) {
      // If image starts with http, use it as-is (full URL from CDN or external service)
      if (product.image.startsWith('http')) {
        return product.image;
      }
    }

    // Default fallback to real Unsplash image based on product name
    return productImageMap[product.name] || generateProductImage(product.name);
  }
  const imageUrl = getImageUrl()

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden card-shadow cursor-pointer group h-full"
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-100 dark:bg-gray-700 overflow-hidden">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 animate-pulse"></div>
        )}
        
        <img
          src={imageUrl}
          alt={product.name}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 ${
            !imageLoaded ? 'opacity-0' : 'opacity-100'
          }`}
        />
        
        {discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
            -{discount}%
          </div>
        )}
        <button
          onClick={handleWishlist}
          className="absolute top-2 left-2 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Heart
            size={18}
            className={inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Name */}
        <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-primary-600 transition">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < Math.floor(product.rating || 4) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviews || 0})</span>
        </div>

        {/* Price */}
        <div className="mb-3 mt-auto">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">{formatPrice(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-lg font-semibold transition-colors"
        >
          <ShoppingCart size={18} />
          Add to Cart
        </button>
      </div>
    </div>
  )
}
