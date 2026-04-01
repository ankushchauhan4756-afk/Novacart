# NovaCart Backend

Backend API for the NovaCart e-commerce platform built with Node.js, Express, and MongoDB.

## Features

- User Authentication (JWT)
- Product Management
- Order Management
- Admin Dashboard
- Cart Management
- Review System
- Coupon System
- Payment Integration (Razorpay)

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcryptjs

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/novacart
JWT_SECRET=your-secret-key
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

3. Start MongoDB service

4. Run the server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- POST `/auth/register` - Register new user
- POST `/auth/login` - Login user
- GET `/auth/verify` - Verify token
- GET `/auth/profile` - Get user profile
- PUT `/auth/profile` - Update profile

### Products
- GET `/products` - Get all products with filters
- GET `/products/:id` - Get product by ID
- GET `/products/search` - Search products
- GET `/products/trending` - Get trending products
- GET `/products/category/:category` - Get products by category

### Orders
- POST `/orders` - Create order
- GET `/orders` - Get user orders
- GET `/orders/:id` - Get order details
- PUT `/orders/:id/status` - Update order status (admin)
- POST `/orders/:id/cancel` - Cancel order

### Admin
- GET `/admin/stats` - Dashboard statistics
- GET `/admin/products` - Manage products
- POST `/admin/products` - Create product
- PUT `/admin/products/:id` - Update product
- DELETE `/admin/products/:id` - Delete product
- GET `/admin/orders` - Manage orders
- GET `/admin/users` - Manage users

## Project Structure

```
backend/
├── config/
│   ├── config.js
│   └── database.js
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   ├── Cart.js
│   ├── Review.js
│   ├── Coupon.js
│   └── Category.js
├── routes/
│   ├── auth.js
│   ├── products.js
│   ├── orders.js
│   └── admin.js
├── .env
├── package.json
└── server.js
```

## Environment Variables

```
PORT - Server port
MONGODB_URI - MongoDB connection string
JWT_SECRET - JWT secret key
RAZORPAY_KEY_ID - Razorpay API key
RAZORPAY_KEY_SECRET - Razorpay secret
EMAIL_HOST - Email service host
EMAIL_USER - Email user
EMAIL_PASS - Email password
CLOUDINARY_NAME - Cloudinary name
CLOUDINARY_API_KEY - Cloudinary API key
CLOUDINARY_API_SECRET - Cloudinary secret
CORS_ORIGIN - CORS allowed origin
NODE_ENV - Environment (development/production)
```

## Testing

Run tests with:
```bash
npm test
```

## License

MIT
