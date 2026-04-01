# NovaCart API Documentation

## Base URL
```
http://localhost:5000
```

## Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer {your_token}
```

---

## 🔐 Authentication Routes

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "securePasswordHere"
}

Response (201):
{
  "success": true,
  "token": "jwt_token",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "isAdmin": false
  }
}
```

### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePasswordHere"
}

Response (200):
{
  "success": true,
  "token": "jwt_token",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "isAdmin": false
  }
}
```

### Verify Token
```http
GET /auth/verify
Headers: Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "user": { ... }
}
```

### Get Profile
```http
GET /auth/profile
Headers: Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "user": { ... }
}
```

### Update Profile
```http
PUT /auth/profile
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Name",
  "phone": "9876543210",
  "address": "123 Main Street"
}

Response (200):
{
  "success": true,
  "user": { ... }
}
```

---

## 📦 Product Routes

### Get All Products
```http
GET /products?category=tech-gadgets&sortBy=newest&limit=12&page=1

Query Parameters:
- category: Product category (optional)
- sortBy: newest, bestSelling, trending, pricelow, pricehigh
- limit: Number of products per page (default: 12)
- page: Page number (default: 1)

Response (200):
{
  "success": true,
  "products": [
    {
      "_id": "product_id",
      "name": "Product Name",
      "price": 4999,
      "originalPrice": 8999,
      "category": "tech-gadgets",
      "rating": 4.5,
      "reviews": 234,
      "image": "image_url",
      "stock": 45
    }
  ],
  "total": 45,
  "pages": 4
}
```

### Get Product by ID
```http
GET /products/:id

Response (200):
{
  "success": true,
  "product": {
    "_id": "product_id",
    "name": "Product Name",
    "description": "Full description",
    "price": 4999,
    "originalPrice": 8999,
    "category": "tech-gadgets",
    "images": ["image1", "image2"],
    "specifications": {
      "Connectivity": "Bluetooth 5.0",
      "Battery Life": "30 hours"
    },
    "rating": 4.5,
    "reviews": 234,
    "stock": 45,
    "discount": 44
  }
}
```

### Search Products
```http
GET /products/search?q=headphones

Response (200):
{
  "success": true,
  "products": [ ... ]
}
```

### Get Trending Products
```http
GET /products/trending?limit=8

Response (200):
{
  "success": true,
  "products": [ ... ]
}
```

### Get Featured Products
```http
GET /products/featured?limit=8

Response (200):
{
  "success": true,
  "products": [ ... ]
}
```

### Get Products by Category
```http
GET /products/category/:category

Response (200):
{
  "success": true,
  "products": [ ... ]
}
```

---

## 🛒 Cart Routes

### Get Cart
```http
GET /cart
Headers: Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "cart": {
    "_id": "cart_id",
    "user": "user_id",
    "items": [
      {
        "product": {
          "_id": "product_id",
          "name": "Product Name",
          "price": 4999
        },
        "quantity": 2,
        "price": 9998,
        "addedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "total": 9998
  }
}
```

### Add to Cart
```http
POST /cart
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "productId": "product_id",
  "quantity": 1
}

Response (201):
{
  "success": true,
  "cart": { ... }
}
```

### Update Cart Item
```http
PUT /cart/:productId
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "quantity": 3
}

Response (200):
{
  "success": true,
  "cart": { ... }
}
```

### Remove from Cart
```http
DELETE /cart/:productId
Headers: Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Item removed from cart",
  "cart": { ... }
}
```

### Clear Cart
```http
DELETE /cart
Headers: Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Cart cleared"
}
```

---

## 📦 Order Routes

### Create Order
```http
POST /orders
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "items": [
    {
      "productId": "product_id",
      "quantity": 2,
      "price": 4999
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001",
    "country": "India"
  },
  "paymentMethod": "card",
  "couponCode": "SAVE10"
}

Response (201):
{
  "success": true,
  "order": {
    "_id": "order_id",
    "orderId": "ORD123456",
    "user": "user_id",
    "items": [ ... ],
    "subtotal": 9998,
    "discount": 999,
    "shipping": 50,
    "tax": 1500,
    "total": 11549,
    "orderStatus": "pending",
    "paymentStatus": "pending",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Get User Orders
```http
GET /orders
Headers: Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "orders": [
    {
      "_id": "order_id",
      "orderId": "ORD123456",
      "items": [ ... ],
      "total": 11549,
      "orderStatus": "delivered",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Get Order by ID
```http
GET /orders/:id
Headers: Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "order": { ... }
}
```

### Update Order Status (Admin)
```http
PUT /orders/:id/status
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "shipped"
}

Response (200):
{
  "success": true,
  "order": { ... }
}
```

### Cancel Order
```http
POST /orders/:id/cancel
Headers: Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Order cancelled successfully"
}
```

---

## ⭐ Review Routes

### Get Product Reviews
```http
GET /reviews/product/:productId

Response (200):
{
  "success": true,
  "reviews": [
    {
      "_id": "review_id",
      "product": "product_id",
      "user": {
        "name": "John Doe"
      },
      "rating": 5,
      "title": "Excellent product!",
      "comment": "Very satisfied with the purchase",
      "helpful": 15,
      "verified": true,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "averageRating": 4.5,
  "totalReviews": 234
}
```

### Create Review
```http
POST /reviews
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "productId": "product_id",
  "orderId": "order_id",
  "rating": 5,
  "title": "Excellent product!",
  "comment": "Very satisfied with the purchase"
}

Response (201):
{
  "success": true,
  "review": {
    "_id": "review_id",
    "product": "product_id",
    "user": "user_id",
    "rating": 5,
    "title": "Excellent product!",
    "comment": "Very satisfied with the purchase",
    "verified": true,
    "status": "approved"
  }
}
```

### Update Review
```http
PUT /reviews/:id
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "rating": 4,
  "title": "Good product",
  "comment": "Updated review"
}

Response (200):
{
  "success": true,
  "review": { ... }
}
```

### Delete Review
```http
DELETE /reviews/:id
Headers: Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Review deleted successfully"
}
```

---

## 🎟️ Coupon Routes

### Validate Coupon
```http
POST /coupons/validate
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "code": "SAVE10",
  "orderTotal": 5000
}

Response (200):
{
  "success": true,
  "coupon": {
    "code": "SAVE10",
    "discountType": "percentage",
    "discountValue": 10,
    "discount": 500,
    "message": "Coupon applied successfully"
  }
}
```

### Get Coupon Details
```http
GET /coupons/:code

Response (200):
{
  "success": true,
  "coupon": {
    "code": "SAVE10",
    "description": "10% discount on all products",
    "discountType": "percentage",
    "discountValue": 10,
    "minOrderAmount": 500
  }
}
```

### Create Coupon (Admin)
```http
POST /coupons
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "code": "NEWCODE",
  "description": "New coupon",
  "discountType": "percentage",
  "discountValue": 15,
  "minOrderAmount": 1000,
  "usageLimit": 100,
  "startDate": "2024-01-01",
  "endDate": "2024-02-01"
}

Response (201):
{
  "success": true,
  "coupon": { ... }
}
```

---

## 📂 Category Routes

### Get All Categories
```http
GET /categories

Response (200):
{
  "success": true,
  "categories": [
    {
      "_id": "category_id",
      "name": "Tech Gadgets",
      "slug": "tech-gadgets",
      "description": "Latest tech gadgets and accessories",
      "icon": "📱",
      "color": "bg-purple-100"
    }
  ]
}
```

### Get Category by ID
```http
GET /categories/:id

Response (200):
{
  "success": true,
  "category": { ... }
}
```

### Create Category (Admin)
```http
POST /categories
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "New Category",
  "slug": "new-category",
  "description": "Category description",
  "icon": "🎯",
  "color": "bg-blue-100"
}

Response (201):
{
  "success": true,
  "category": { ... }
}
```

### Update Category (Admin)
```http
PUT /categories/:id
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Category",
  "description": "Updated description"
}

Response (200):
{
  "success": true,
  "category": { ... }
}
```

### Delete Category (Admin)
```http
DELETE /categories/:id
Headers: Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Category deleted successfully"
}
```

---

## 💳 Payment Routes

### Initiate Payment
```http
POST /payments/initiate
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "orderId": "order_id",
  "amount": 11549
}

Response (200):
{
  "success": true,
  "paymentId": "razorpay_payment_id",
  "amount": 11549,
  "currency": "INR",
  "key": "your_razorpay_key"
}
```

### Verify Payment
```http
POST /payments/verify
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "orderId": "order_id",
  "paymentId": "razorpay_payment_id",
  "signature": "razorpay_signature"
}

Response (200):
{
  "success": true,
  "order": {
    "paymentStatus": "confirmed",
    "orderStatus": "confirmed"
  }
}
```

### Get Payment Status
```http
GET /payments/:paymentId
Headers: Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "payment": {
    "paymentId": "razorpay_payment_id",
    "status": "confirmed",
    "amount": 11549,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

## 📊 Admin Routes

### Get Dashboard Stats
```http
GET /admin/stats
Headers: Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "stats": {
    "totalOrders": 150,
    "totalRevenue": 500000,
    "totalProducts": 50,
    "totalUsers": 100,
    "recentOrders": [ ... ]
  }
}
```

### Get All Products (Admin)
```http
GET /admin/products
Headers: Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "products": [ ... ]
}
```

### Create Product (Admin)
```http
POST /admin/products
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "New Product",
  "description": "Product description",
  "price": 4999,
  "originalPrice": 8999,
  "category": "tech-gadgets",
  "stock": 50,
  "images": ["image_url1", "image_url2"]
}

Response (201):
{
  "success": true,
  "product": { ... }
}
```

### Update Product (Admin)
```http
PUT /admin/products/:id
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Product Name",
  "price": 3999,
  "stock": 40
}

Response (200):
{
  "success": true,
  "product": { ... }
}
```

### Delete Product (Admin)
```http
DELETE /admin/products/:id
Headers: Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Product deleted successfully"
}
```

### Get All Orders (Admin)
```http
GET /admin/orders
Headers: Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "orders": [ ... ]
}
```

### Get All Users (Admin)
```http
GET /admin/users
Headers: Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "users": [ ... ]
}
```

---

## 🔍 Error Responses

### Authentication Error
```json
{
  "success": false,
  "message": "Authentication failed. Please login.",
  "statusCode": 401
}
```

### Authorization Error (Admin)
```json
{
  "success": false,
  "message": "Admin access required.",
  "statusCode": 403
}
```

### Not Found Error
```json
{
  "success": false,
  "message": "Resource not found.",
  "statusCode": 404
}
```

### Validation Error
```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": {
    "email": "Invalid email format",
    "password": "Password must be at least 6 characters"
  },
  "statusCode": 400
}
```

### Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "statusCode": 500
}
```

---

## 📝 Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Admin access required |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Internal server error |

---

## 🧪 Testing with Postman/Thunder Client

1. **Import Collection**
   - Create a new collection
   - Add requests for each endpoint

2. **Set Environment Variables**
   ```json
   {
     "baseUrl": "http://localhost:5000",
     "token": "your_jwt_token",
     "userId": "your_user_id"
   }
   ```

3. **Test Authentication**
   - First, login to get a token
   - Add token to Authorization header for protected routes

4. **Test Flow**
   - Register/Login → Get token
   - Browse products
   - Add to cart
   - Create order
   - Track order
   - Leave review

---

**Last Updated: 2024**

For more help, refer to SETUP_GUIDE.md
