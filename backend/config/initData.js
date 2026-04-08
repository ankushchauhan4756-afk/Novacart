import bcryptjs from 'bcryptjs'
import User from '../models/User.js'
import Product from '../models/Product.js'
import Category from '../models/Category.js'
import Coupon from '../models/Coupon.js'

const SAMPLE_CATEGORIES = [
  {
    name: 'Fashion',
    slug: 'fashion',
    description: 'Trendy fashion items for everyone',
    icon: '👗',
    color: 'bg-pink-100',
    displayOrder: 1,
  },
  {
    name: 'Clothes',
    slug: 'clothes',
    description: 'Comfortable and stylish clothing',
    icon: '👕',
    color: 'bg-blue-100',
    displayOrder: 2,
  },
  {
    name: 'Tech Gadgets',
    slug: 'tech-gadgets',
    description: 'Latest tech gadgets and accessories',
    icon: '📱',
    color: 'bg-purple-100',
    displayOrder: 3,
  },
  {
    name: 'Fruits',
    slug: 'fruits',
    description: 'Fresh and organic fruits',
    icon: '🍎',
    color: 'bg-red-100',
    displayOrder: 4,
  },
  {
    name: 'Vegetables',
    slug: 'vegetables',
    description: 'Fresh vegetables from local farms',
    icon: '🥕',
    color: 'bg-green-100',
    displayOrder: 5,
  },
]

const SAMPLE_PRODUCTS = [
  {
    name: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.',
    price: 4999,
    originalPrice: 8999,
    category: 'tech-gadgets',
    image: '/images/products/headphones.webp',
    stock: 45,
    rating: 4.5,
    reviews: 234,
    isFeatured: true,
    isTrending: true,
    discount: 44,
    specifications: {
      Connectivity: 'Bluetooth 5.0',
      'Battery Life': '30 hours',
      'Noise Cancellation': 'Active',
      Warranty: '2 years',
    },
    tags: ['electronics', 'headphones', 'audio'],
  },
  {
    name: 'Cotton T-Shirt',
    description: '100% premium cotton t-shirt. Comfortable, breathable, and perfect for daily wear. Available in multiple colors.',
    price: 599,
    originalPrice: 1299,
    category: 'clothes',
    image: '/images/products/tshirt.avif',
    stock: 120,
    rating: 4,
    reviews: 145,
    isFeatured: true,
    discount: 54,
    specifications: {
      Material: '100% Cotton',
      'Size Range': 'XS to XXL',
      Care: 'Machine washable',
    },
    tags: ['clothing', 'casual', 'comfortable'],
  },
  {
    name: 'Stylish Sunglasses',
    description: 'UV protected trendy sunglasses with premium quality frames. Perfect for summer and outdoor activities.',
    price: 2999,
    originalPrice: 5999,
    category: 'fashion',
    image: '/images/products/sunglasses.jpg',
    stock: 30,
    rating: 4.8,
    reviews: 312,
    isFeatured: true,
    isTrending: true,
    discount: 50,
    specifications: {
      'UV Protection': '100% UV400',
      'Frame Material': 'Polycarbonate',
      Warranty: '1 year',
    },
    tags: ['fashion', 'accessories', 'summer'],
  },
  {
    name: 'Fresh Apples - 1kg',
    description: 'Fresh, juicy apples directly from the farm. Rich in vitamins and antioxidants. Perfect for healthy eating.',
    price: 199,
    category: 'fruits',
    image: '/images/products/apples.jpg',
    stock: 200,
    rating: 4.2,
    reviews: 89,
    specifications: {
      Type: 'Red Delicious',
      Origin: 'Shimla',
      Quantity: '1kg (approximately 4-5 apples)',
    },
    tags: ['fruits', 'fresh', 'organic'],
  },
  {
    name: 'Smart Watch Pro',
    description: 'Feature-rich smartwatch with health tracking, notifications, and water resistance. Perfect companion for your daily activities.',
    price: 9999,
    originalPrice: 14999,
    category: 'tech-gadgets',
    image: '/images/products/watch.webp',
    stock: 35,
    rating: 4.6,
    reviews: 423,
    isFeatured: true,
    isTrending: true,
    discount: 33,
    specifications: {
      Display: 'AMOLED 1.4 inch',
      Battery: '6 days',
      'Water Resistance': '5ATM',
      Warranty: '1 year',
    },
    tags: ['wearable', 'smartwatch', 'fitness'],
  },
  {
    name: 'Designer Handbag',
    description: 'Elegant designer handbag made with premium leather. Perfect for both casual and formal occasions.',
    price: 3999,
    originalPrice: 7999,
    category: 'fashion',
    image: '/images/products/handbag.jpg',
    stock: 20,
    rating: 4.7,
    reviews: 267,
    isFeatured: true,
    discount: 50,
    specifications: {
      Material: 'Premium Leather',
      Capacity: '12L',
      Compartments: 'Multiple',
      Warranty: '2 years',
    },
    tags: ['fashion', 'bags', 'luxury'],
  },
  {
    name: 'Blue Denim Jeans',
    description: 'Classic blue denim jeans with perfect fit and comfort. Suitable for all body types and occasions.',
    price: 1999,
    originalPrice: 3999,
    category: 'clothes',
    image: '/images/products/jeans.webp',
    stock: 80,
    rating: 4.4,
    reviews: 198,
    discount: 50,
    specifications: {
      Material: '98% Cotton, 2% Elastane',
      Fit: 'Slim Fit',
      Sizes: '28 to 36',
      Care: 'Machine washable',
    },
    tags: ['clothing', 'jeans', 'casual'],
  },
  {
    name: 'Organic Bananas - 1kg',
    description: 'Fresh organic bananas packed with potassium and nutrients. Perfect for breakfast and smoothies.',
    price: 79,
    category: 'fruits',
    image: '/images/products/bananas.jpg',
    stock: 150,
    rating: 4.3,
    reviews: 112,
    specifications: {
      Type: 'Organic Cavendish',
      Quantity: '1kg (6-8 bananas)',
      Origin: 'Kerala',
    },
    tags: ['fruits', 'fresh', 'organic', 'healthy'],
  },
  {
    name: 'Fresh Carrots - 1kg',
    description: 'Fresh, crunchy carrots loaded with beta-carotene. Perfect for salads, cooking, and snacking.',
    price: 49,
    category: 'vegetables',
    image: '/images/products/carrots.png',
    stock: 180,
    rating: 4.1,
    reviews: 76,
    specifications: {
      Type: 'Orange Carrots',
      Quantity: '1kg',
      Origin: 'Punjab',
    },
    tags: ['vegetables', 'fresh', 'healthy'],
  },
  {
    name: 'Wireless Keyboard',
    description: 'Compact wireless keyboard with silent keys and long battery life. Perfect for office and home use.',
    price: 1499,
    originalPrice: 2999,
    category: 'tech-gadgets',
    image: '/images/products/keyboard.jpg',
    stock: 60,
    rating: 4.3,
    reviews: 134,
    discount: 50,
    specifications: {
      Connection: 'Wireless 2.4GHz',
      'Battery Life': '24 months',
      Keys: 'Silent mechanical',
      Warranty: '1 year',
    },
    tags: ['tech', 'keyboard', 'accessories'],
  },
]

const SAMPLE_COUPONS = [
  {
    code: 'SAVE10',
    description: '10% discount on all products',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 500,
    usageLimit: 100,
    isActive: true,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
  {
    code: 'SAVE20',
    description: '20% discount on orders above 2000',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 2000,
    maxDiscount: 1000,
    usageLimit: 50,
    isActive: true,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
  {
    code: 'FLAT500',
    description: 'Flat ₹500 off on orders above 3000',
    discountType: 'fixed',
    discountValue: 500,
    minOrderAmount: 3000,
    usageLimit: 75,
    isActive: true,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
]

export const initializeData = async () => {
  try {
    const adminUser = await User.findOne({ isAdmin: true })
    let admin = adminUser

    if (!admin) {
      console.log('[INIT] No admin user found; creating default admin')
      const salt = await bcryptjs.genSalt(10)
      const hashedPassword = await bcryptjs.hash('admin123', salt)
      admin = await User.create({
        name: 'Admin User',
        email: 'admin@novacart.com',
        phone: '9876543210',
        password: hashedPassword,
        isAdmin: true,
        role: 'admin',
      })
      console.log('[INIT] Admin user created: admin@novacart.com / admin123')
    }

    const categoryCount = await Category.countDocuments()
    if (categoryCount === 0) {
      await Category.insertMany(SAMPLE_CATEGORIES)
      console.log('[INIT] Sample categories created')
    }

    const productCount = await Product.countDocuments({ status: 'active' })
    if (productCount === 0) {
      const productsWithSeller = SAMPLE_PRODUCTS.map((product) => ({
        ...product,
        seller: admin._id,
      }))
      await Product.insertMany(productsWithSeller)
      console.log('[INIT] Sample products created')
    }

    const couponCount = await Coupon.countDocuments()
    if (couponCount === 0) {
      await Coupon.insertMany(SAMPLE_COUPONS)
      console.log('[INIT] Sample coupons created')
    }
  } catch (error) {
    console.error('[INIT] Database initialization failed:', error)
  }
}
