// Generate product images as SVG data URIs with product names
export const generateProductImage = (productName, color = '#3B82F6') => {
  const encodedName = encodeURIComponent(productName.substring(0, 20));
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500'%3E%3Crect width='500' height='500' fill='${color.replace('#', '%23')}'/%3E%3Ctext x='250' y='180' text-anchor='middle' font-size='24' font-weight='bold' fill='white' font-family='Arial'%3E${encodedName}%3C/text%3E%3Ctext x='250' y='350' text-anchor='middle' font-size='14' fill='rgba(255,255,255,0.7)' font-family='Arial'%3ENova Cart%3C/text%3E%3C/svg%3E`;
};

export const PRODUCT_IMAGES = {
  'Premium Wireless Headphones': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'Cotton T-Shirt': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'Stylish Sunglasses': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'Fresh Apples - 1kg': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'Smart Watch Pro': 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  'Designer Handbag': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'Blue Denim Jeans': 'linear-gradient(135deg, #405de6 0%, #5b51d8 100%)',
  'Organic Bananas - 1kg': 'linear-gradient(135deg, #ffd89b 0%, #19547b 100%)',
  'Fresh Carrots - 1kg': 'linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)',
  'Wireless Keyboard': 'linear-gradient(135deg, #2e2e78 0%, #662d8c 100%)',
};
