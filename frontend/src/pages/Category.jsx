import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { productService } from '../services/api'
import { generateProductImage } from '../utils/productImages'

// Map product names to local downloaded images
const PRODUCT_IMAGE_MAP = {
  'Premium Wireless Headphones': '/images/products/keyboard.jpg',
  'Cotton T-Shirt': '/images/products/keyboard.jpg',
  'Stylish Sunglasses': '/images/products/keyboard.jpg',
  'Fresh Apples - 1kg': '/images/products/apples.jpg',
  'Smart Watch Pro': '/images/products/keyboard.jpg',
  'Designer Handbag': '/images/products/keyboard.jpg',
  'Blue Denim Jeans': '/images/products/jeans.webp',
  'Organic Bananas - 1kg': '/images/products/bananas.jpg',
  'Fresh Carrots - 1kg': '/images/products/carrots.png',
  'Wireless Keyboard': '/images/products/keyboard.jpg',
};

const CATEGORY_MAP = {
  'fashion': 'Fashion',
  'clothes': 'Clothes',
  'tech-gadgets': 'Tech Gadgets',
  'fruits': 'Fruits',
  'vegetables': 'Vegetables',
}

export default function Category() {
  const { category } = useParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        console.log('Fetching products for category:', category)
        
        // Fetch products filtered by category
        const response = await productService.getProducts({ 
          category: category,
          limit: 50
        })
        
        console.log('Category response:', response)
        
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
      } catch (err) {
        console.error('Failed to fetch category products:', err)
        setError('Failed to load products. Please try again.')
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    
    if (category) {
      fetchCategoryProducts()
    }
  }, [category])

  const categoryName = CATEGORY_MAP[category] || category

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="section-container py-12">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4 font-semibold"
          >
            <ChevronLeft size={20} />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-2">{categoryName}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {loading ? 'Loading products...' : `Showing ${products.length} product${products.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && !error && (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
              No products found in this category
            </p>
            <Link 
              to="/" 
              className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
