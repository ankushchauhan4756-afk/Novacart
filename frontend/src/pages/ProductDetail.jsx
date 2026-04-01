import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, ShoppingCart, Heart, ChevronUp, ChevronDown } from 'lucide-react'
import { formatPrice, calculateDiscount } from '../utils/helpers'
import { useStore } from '../store/useStore'
import { productService } from '../services/api'
import { generateProductImage } from '../utils/productImages'

// Sample product data
const SAMPLE_PRODUCTS = {
  1: {
    id: 1,
    name: 'Premium Wireless Headphones',
    price: 4999,
    originalPrice: 8999,
    rating: 4.5,
    reviews: 234,
    image: '/images/products/headphones.webp',
    category: 'tech-gadgets',
    description:
      'Experience crystal-clear audio with our premium wireless headphones. Features active noise cancellation, 30-hour battery life, and Bluetooth 5.0 connectivity.',
    specs: {
      'Connectivity': 'Bluetooth 5.0',
      'Battery Life': '30 hours',
      'Noise Cancellation': 'Active',
      'Warranty': '2 years',
    },
    inStock: true,
  },
  // Add more products as needed
}

export default function ProductDetail() {
  const { id } = useParams()
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore()
  const [quantity, setQuantity] = useState(1)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('description')

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

  // Helper function to get proper image URL
  const getImageUrl = (imageField, productName) => {
    // First check if we have a direct mapping for this product name
    if (productImageMap[productName]) {
      return productImageMap[productName];
    }

    // Then check if image is a full URL
    if (imageField && imageField.startsWith('http')) {
      return imageField;
    }

    // If no image field or it's a path, use fallback
    return generateProductImage(productName);
  }

  useEffect(() => {
    // Fetch product from backend
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await productService.getProductById(id)
        const fetchedProduct = response.product || response.data?.product || response
        
        // Map MongoDB response to component format
        const formattedProduct = {
          id: fetchedProduct._id,
          name: fetchedProduct.name,
          price: fetchedProduct.price,
          originalPrice: fetchedProduct.originalPrice || fetchedProduct.price,
          rating: fetchedProduct.rating || 4.5,
          reviews: fetchedProduct.reviews || 0,
          image: getImageUrl(fetchedProduct.image, fetchedProduct.name),
          category: fetchedProduct.category,
          description: fetchedProduct.description || 'Premium quality product.',
          specs: fetchedProduct.specs || {},
          inStock: fetchedProduct.inStock !== false,
        }
        setProduct(formattedProduct)
      } catch (error) {
        console.error('Failed to fetch product:', error)
        // Fallback to sample product with real image
        const sampleProduct = SAMPLE_PRODUCTS[id] || {
          id,
          name: 'Premium Product',
          price: 4999,
          originalPrice: 8999,
          rating: 4.5,
          reviews: 234,
          image: generateProductImage('Premium Product'),
          category: 'tech-gadgets',
          description: 'This is a premium quality product with excellent features.',
          specs: {
            'Material': 'Premium Quality',
            'Warranty': '2 years',
          },
          inStock: true,
        }
        setProduct(sampleProduct)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  if (loading) {
    return (
      <div className="section-container py-12">
        <div className="animate-shimmer h-96 rounded-lg"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="section-container py-12 text-center">
        <p>Product not found</p>
      </div>
    )
  }

  const inWishlist = isInWishlist(product.id)
  const discount = calculateDiscount(product.originalPrice || product.price, product.price)

  const handleAddToCart = () => {
    addToCart({ ...product, quantity })
    setQuantity(1)
  }

  const handleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  return (
    <div className="section-container py-12">
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-2 text-sm">
        <Link to="/" className="text-primary-600 hover:underline">
          Home
        </Link>
        <span>/</span>
        <Link to={`/category/${product.category}`} className="text-primary-600 hover:underline">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-gray-600">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-12">
        {/* Image */}
        <div className="flex flex-col gap-4">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden aspect-square">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {discount > 0 && (
            <div className="text-center">
              <span className="inline-block bg-red-500 text-white px-4 py-2 rounded-lg font-bold">
                Save {discount}% - {formatPrice(product.originalPrice - product.price)}
              </span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold">{product.rating}</span>
              </div>
              <span className="text-gray-600">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl font-bold text-primary-600">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-2xl text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {product.inStock ? (
                  <span className="text-green-600 font-semibold">In Stock</span>
                ) : (
                  <span className="text-red-600 font-semibold">Out of Stock</span>
                )}
              </p>
            </div>

            {/* Description */}
            <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div className="mb-8">
              <label className="block text-sm font-semibold mb-3">Quantity</label>
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg w-max">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <ChevronDown size={20} />
                </button>
                <span className="px-6 py-2 border-l border-r border-gray-300 dark:border-gray-600 font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <ChevronUp size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-bold transition"
            >
              <ShoppingCart size={20} />
              Add to Cart
            </button>
            <button
              onClick={handleWishlist}
              className={`px-6 py-3 border-2 rounded-lg font-bold transition ${
                inWishlist
                  ? 'border-red-500 text-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-500'
              }`}
            >
              <Heart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-800 mb-8">
        <div className="flex gap-8">
          {['description', 'specifications', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 font-semibold capitalize border-b-2 transition ${
                activeTab === tab
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'description' && (
          <div className="prose dark:prose-invert max-w-none">
            <p>{product.description}</p>
          </div>
        )}

        {activeTab === 'specifications' && (
          <div className="space-y-4">
            {Object.entries(product.specs || {}).map(([key, value]) => (
              <div key={key} className="flex border-b border-gray-200 dark:border-gray-800 pb-4">
                <dt className="font-semibold text-gray-700 dark:text-gray-300 w-40">{key}</dt>
                <dd className="text-gray-600 dark:text-gray-400">{value}</dd>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="text-center text-gray-600 dark:text-gray-400 py-8">
            <p>Reviews will be displayed here</p>
          </div>
        )}
      </div>
    </div>
  )
}
