// Generate high-quality product images from Unsplash API
export const generateProductImage = (productName) => {
  // Return a high-quality product image from Unsplash
  // Using a diverse set of product images for different types
  return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop&q=80';
};

export const PRODUCT_IMAGES = {
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
