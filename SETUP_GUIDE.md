# Complete Setup Guide - NovaCart E-Commerce Application

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ ([Download](https://nodejs.org/))
- MongoDB 4.4+ ([Download](https://www.mongodb.com/try/download/community))
- Git
- VS Code (Recommended)

---

## 📦 Project Structure

```
novaCart/
├── frontend/                 # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── pages/           # All page components
│   │   ├── components/      # Reusable components
│   │   ├── store/           # Zustand store (state management)
│   │   ├── services/        # API integration
│   │   ├── layouts/         # Layout wrappers
│   │   ├── utils/           # Helper functions
│   │   ├── index.css        # Global styles
│   │   ├── App.jsx          # Main component
│   │   └── main.jsx         # Entry point
│   ├── public/              # Static assets
│   ├── .env                 # Environment variables
│   ├── vite.config.js       # Vite configuration
│   ├── tailwind.config.js   # Tailwind configuration
│   └── package.json
│
├── backend/                 # Node.js + Express + MongoDB
│   ├── config/              # Configuration files
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API routes
│   ├── .env                 # Environment variables
│   ├── server.js            # Express app
│   ├── seed.js              # Database seeding script
│   └── package.json
│
└── docs/                    # Documentation
```

---

## 🔧 Installation & Setup

### Step 1: Setup MongoDB

**Option A: Local MongoDB**
```bash
# On Windows (if installed)
# MongoDB should auto-start as service

# Check if running
mongo --version
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a cluster and get connection string
4. Update `MONGODB_URI` in backend `.env`

### Step 2: Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create/update .env file with your MongoDB URI
# Edit: MONGODB_URI=mongodb://localhost:27017/novacart

# Seed database with sample data
npm run seed

# Start backend server
npm run dev
```

**Backend runs on:** `http://localhost:5000`

### Step 3: Frontend Setup

```bash
# Open new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Create/update .env file
# File should contain: VITE_API_BASE=http://localhost:5000

# Start development server
npm run dev
```

**Frontend runs on:** `http://localhost:3000`

---

## 🧪 Testing the Application

### Demo Credentials

**Admin Account:**
- Email: `admin@novacart.com`
- Password: `admin123`

**User Account:**
- Email: `john@novacart.com`
- Password: `user123`

### Test Coupon Codes
- `SAVE10` - 10% discount
- `SAVE20` - 20% discount (min ₹2000)
- `FLAT500` - ₹500 flat discount (min ₹3000)

### Features to Test

1. **Homepage**
   - View hero banner slider
   - Browse categories
   - See trending products
   - Subscribe to newsletter

2. **Product Browsing**
   - Click products to view details
   - Read specifications
   - Check ratings and reviews
   - Add to cart/wishlist

3. **Shopping Cart**
   - Add/remove products
   - Update quantities
   - Apply coupon codes
   - View total price

4. **Checkout**
   - Multi-step checkout process
   - Fill shipping address
   - Select payment method
   - Place order
   - See order confirmation

5. **User Dashboard**
   - View order history
   - Manage wishlist
   - Update profile

6. **Admin Panel**
   - View dashboard statistics
   - Manage products
   - Manage orders
   - View all users

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000
```

### Authentication Endpoints

#### Register
```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "password123"
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "token": "jwt_token_here",
  "user": { ... }
}
```

### Products Endpoints

#### Get All Products
```
GET /products?category=tech-gadgets&sortBy=newest&limit=12&page=1
```

#### Get Product by ID
```
GET /products/:id
```

#### Search Products
```
GET /products/search?q=headphones
```

### Cart Endpoints

#### Get Cart
```
GET /cart
Headers: Authorization: Bearer {token}
```

#### Add to Cart
```
POST /cart
Headers: Authorization: Bearer {token}

{
  "productId": "product_id_here",
  "quantity": 1
}
```

#### Update Cart Item
```
PUT /cart/:productId
Headers: Authorization: Bearer {token}

{
  "quantity": 2
}
```

### Orders Endpoints

#### Create Order
```
POST /orders
Headers: Authorization: Bearer {token}

{
  "items": [...],
  "shippingAddress": { ... },
  "paymentMethod": "card",
  "couponCode": "SAVE10"
}
```

#### Get User Orders
```
GET /orders
Headers: Authorization: Bearer {token}
```

### Admin Endpoints

#### Get Dashboard Stats
```
GET /admin/stats
Headers: Authorization: Bearer {token}
```

#### Manage Products
```
GET /admin/products
POST /admin/products
PUT /admin/products/:id
DELETE /admin/products/:id
Headers: Authorization: Bearer {token}
```

---

## 🎯 Key Features Implemented

### Frontend
✅ Responsive design (Mobile, Tablet, Desktop)
✅ Dark/Light mode toggle
✅ Product listing with filters and sorting
✅ Shopping cart with quantity management
✅ Multi-step checkout process
✅ User authentication and dashboard
✅ Admin panel with analytics
✅ Wishlist functionality
✅ Coupon code validation
✅ Order tracking
✅ Review and ratings system

### Backend
✅ JWT authentication
✅ Product CRUD operations
✅ Order management with status tracking
✅ Cart management
✅ Coupon validation
✅ Admin dashboard statistics
✅ User management
✅ Review system
✅ Payment gateway integration (mock)
✅ Category management

### Database
✅ 7 MongoDB collections
✅ Relationships and references
✅ Proper indexing for search
✅ User role-based access

---

## 🚨 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017

Solution:
1. Make sure MongoDB is running
2. Check MONGODB_URI in .env file
3. On Windows: Check if MongoDB service is running
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000

Solution:
# Find and kill process using port 5000
# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -ti:5000 | xargs kill -9
```

### CORS Error
```
Error: Cross-Origin Request Blocked

Solution:
1. Make sure backend is running on port 5000
2. Check CORS_ORIGIN in backend .env
3. Restart backend server
```

### Module Not Found
```
Error: Cannot find module

Solution:
npm install
# Make sure all dependencies are installed
```

---

## 📦 Build & Deployment

### Build Frontend
```bash
cd frontend
npm run build

# Output in dist/ folder - ready for production
```

### Build Backend
```bash
# Backend is ready to deploy as-is
# Just set NODE_ENV=production in .env
```

### Deployment Options

**Frontend:**
- Vercel (recommend)
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

**Backend:**
- Heroku
- Railway
- Render
- AWS EC2
- DigitalOcean

**Database:**
- MongoDB Atlas (Cloud)
- AWS DocumentDB

---

## 🔐 Security Notes

⚠️ **For Production:**

1. Change JWT_SECRET to a strong random string
2. Set NODE_ENV=production
3. Enable HTTPS
4. Use environment variables properly
5. Add rate limiting
6. Enable CORS for specific domains
7. Hash passwords (already done with bcryptjs)
8. Add input validation and sanitization
9. Set up HTTPS/SSL certificate
10. Use secure database connection

---

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/novacart
JWT_SECRET=change-this-to-strong-secret-key
JWT_EXPIRES_IN=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```env
VITE_API_BASE=http://localhost:5000
```

---

## 🎨 Customization

### Change Theme Colors
Edit `tailwind.config.js`:
```js
colors: {
  primary: {
    500: '#your-color',
    600: '#your-color',
  }
}
```

### Add Your Logo
Replace logo in `src/components/Navbar.jsx`

### Modify Categories
Edit `seed.js` → `SAMPLE_CATEGORIES`

### Add More Products
Edit `seed.js` → `SAMPLE_PRODUCTS`

---

## 📞 Support

### Common Commands

```bash
# Start frontend
cd frontend && npm run dev

# Start backend
cd backend && npm run dev

# Seed database
cd backend && npm run seed

# Build frontend
cd frontend && npm run build

# Test API
# Use Postman or Thunder Client
```

### File Locations

- Frontend Pages: `frontend/src/pages/`
- Frontend Components: `frontend/src/components/`
- Backend Routes: `backend/routes/`
- Backend Models: `backend/models/`
- Database Seeds: `backend/seed.js`

---

## 🎉 You're All Set!

Your NovaCart e-commerce application is ready to use!

**Next Steps:**
1. Start MongoDB
2. Run backend: `npm run dev` (in backend folder)
3. Run frontend: `npm run dev` (in frontend folder)
4. Open http://localhost:3000
5. Login with demo credentials
6. Explore all features!

---

**Made with ❤️ for amazing e-commerce experience!**
