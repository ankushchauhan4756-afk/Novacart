import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Truck, Shield, Award } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { productService } from '../services/api'
import { generateProductImage, PRODUCT_IMAGES } from '../utils/productImages'

const PRODUCT_IMAGE_MAP = PRODUCT_IMAGES

const HERO_BANNERS = [
  {
    id: 1,
    title: 'Summer Mega Sale',
    subtitle: 'Enjoy up to 70% off on selected items',
    bgColor: 'bg-gradient-to-r from-purple-600 to-blue-600',
  },
  {
    id: 2,
    title: 'New Arrivals',
    subtitle: 'Check out our latest collections',
    bgColor: 'bg-gradient-to-r from-blue-600 to-cyan-600',
  },
  {
    id: 3,
    title: 'Flash Deals',
    subtitle: 'Limited time offers - Shop now',
    bgColor: 'bg-gradient-to-r from-pink-600 to-purple-600',
  },
]

const CATEGORIES = [
  {
    name: 'Fashion',
    path: '/category/fashion',
    icon: '👗',
    color: 'bg-pink-100 dark:bg-pink-900/20',
  },
  {
    name: 'Clothes',
    path: '/category/clothes',
    icon: '👕',
    color: 'bg-blue-100 dark:bg-blue-900/20',
  },
  {
    name: 'Tech Gadgets',
    path: '/category/tech-gadgets',
    icon: '📱',
    color: 'bg-purple-100 dark:bg-purple-900/20',
  },
  {
    name: 'Fruits',
    path: '/category/fruits',
    icon: '🍎',
    color: 'bg-red-100 dark:bg-red-900/20',
  },
]

// Sample products
const FEATURED_PRODUCTS = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    price: 4999,
    originalPrice: 8999,
    rating: 4.5,
    reviews: 234,
    image: PRODUCT_IMAGE_MAP['Premium Wireless Headphones'],
    category: 'tech-gadgets',
  },
  {
    id: 2,
    name: 'Cotton T-Shirt',
    price: 599,
    originalPrice: 1299,
    rating: 4,
    reviews: 145,
    image: PRODUCT_IMAGE_MAP['Cotton T-Shirt'],
    category: 'clothes',
  },
  {
    id: 3,
    name: 'Stylish Sunglasses',
    price: 2999,
    originalPrice: 5999,
    rating: 4.8,
    reviews: 312,
    image: PRODUCT_IMAGE_MAP['Stylish Sunglasses'],
    category: 'fashion',
  },
  {
    id: 4,
    name: 'Fresh Apples - 1kg',
    price: 199,
    rating: 4.2,
    reviews: 89,
    image: PRODUCT_IMAGE_MAP['Fresh Apples - 1kg'],
    category: 'fruits',
  },
  {
    id: 5,
    name: 'Smart Watch Pro',
    price: 9999,
    originalPrice: 14999,
    rating: 4.6,
    reviews: 423,
    image: PRODUCT_IMAGE_MAP['Smart Watch Pro'],
    category: 'tech-gadgets',
  },
  {
    id: 6,
    name: 'Designer Handbag',
    price: 3999,
    originalPrice: 7999,
    rating: 4.7,
    reviews: 267,
    image: PRODUCT_IMAGE_MAP['Designer Handbag'],
    category: 'fashion',
  },
  {
    id: 7,
    name: 'Blue Denim Jeans',
    price: 1999,
    originalPrice: 3999,
    rating: 4.4,
    reviews: 198,
    image: PRODUCT_IMAGE_MAP['Blue Denim Jeans'],
    category: 'clothes',
  },
  {
    id: 8,
    name: 'Organic Bananas - 1kg',
    price: 79,
    rating: 4.3,
    reviews: 112,
    image: PRODUCT_IMAGE_MAP['Organic Bananas - 1kg'],
    category: 'fruits',
  },
]

export default function Home() {
  const [currentBanner, setCurrentBanner] = useState(0)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch real products from API
    const fetchProducts = async () => {
      try {
        const response = await productService.getProducts({ limit: 8 })
        const fetchedProducts = response.products || response.data?.products || []
        // Map MongoDB response to component format with fallback to real Unsplash images
        const formattedProducts = fetchedProducts.map(p => ({
          id: p._id,
          name: p.name,
          price: p.price,
          originalPrice: p.originalPrice || p.price,
          rating: p.rating || 4.5,
          reviews: p.reviews || 0,
          image: PRODUCT_IMAGE_MAP[p.name] || p.image || generateProductImage(p.name),
          category: p.category,
        }))
        setProducts(formattedProducts)
      } catch (error) {
        console.error('Failed to fetch products:', error)
        setProducts(FEATURED_PRODUCTS)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % HERO_BANNERS.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero Banner */}
      <div className="h-96 relative overflow-hidden">
        {HERO_BANNERS.map((banner, idx) => (
          <div
            key={banner.id}
            className={`absolute inset-0 ${banner.bgColor} transition-opacity duration-1000 ${
              idx === currentBanner ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="h-full flex items-center justify-center text-white">
              <div className="text-center">
                <h1 className="text-5xl font-bold mb-4">{banner.title}</h1>
                <p className="text-xl mb-8 text-white/90">{banner.subtitle}</p>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-transform hover:scale-105"
                >
                  Shop Now <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Banner Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {HERO_BANNERS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentBanner(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentBanner ? 'w-8 bg-white' : 'w-2 bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="section-container py-12 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
            <Zap className="text-primary-600" size={28} />
          </div>
          <div>
            <h3 className="font-bold">Fast Delivery</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">24-48 hours delivery</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
            <Shield className="text-primary-600" size={28} />
          </div>
          <div>
            <h3 className="font-bold">Secure Payment</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">100% secure transactions</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
            <Truck className="text-primary-600" size={28} />
          </div>
          <div>
            <h3 className="font-bold">Free Shipping</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">On orders above ₹500</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
            <Award className="text-primary-600" size={28} />
          </div>
          <div>
            <h3 className="font-bold">Quality Assured</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Premium products</p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="section-container py-12">
        <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((category) => (
            <Link
              key={category.path}
              to={category.path}
              className={`${category.color} p-6 rounded-lg hover:shadow-lg transition-all hover:scale-105 cursor-pointer text-center group`}
            >
              <div className="text-4xl mb-2 group-hover:scale-125 transition-transform">
                {category.icon}
              </div>
              <p className="font-bold text-gray-900 dark:text-white">{category.name}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Trending Products */}
      <div className="section-container py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Trending Now</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Most popular products right now</p>
          </div>
          <Link
            to="/"
            className="btn-primary text-sm"
          >
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Best Deals */}
      <div className="section-container py-12 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-12">
          <div>
            <h2 className="text-4xl font-bold mb-4">Best Deals</h2>
            <p className="text-lg text-white/90 mb-6">
              Unbeatable prices on premium products. Limited time offers!
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-transform hover:scale-105"
            >
              Explore Deals <ArrowRight size={20} />
            </Link>
          </div>
          <div className="text-6xl font-bold opacity-20">70% OFF</div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="section-container py-12">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Get notified about our latest offers and exclusive deals
          </p>
          <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button type="submit" className="btn-primary">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
