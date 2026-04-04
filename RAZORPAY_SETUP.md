# Razorpay Payment Integration Setup Guide

## Overview
This guide will help you integrate Razorpay payment gateway into your NovaCart eCommerce application.

## Prerequisites
- Razorpay account (test mode for development)
- Node.js backend with Express
- React frontend

## Backend Setup

### 1. Environment Variables
Update your `.env` file in the backend directory:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_secret_key_here
```

### 2. Get Razorpay Credentials
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up/Login to your account
3. Go to Settings → API Keys
4. Generate Test API Key ID and Key Secret
5. Replace the placeholder values in `.env`

### 3. Install Dependencies
The required dependencies are already installed:
- `razorpay`: For server-side integration
- `crypto`: Built-in Node.js module for signature verification

## Frontend Setup

### 1. Install Dependencies
The Razorpay checkout script is already added to `index.html`:
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

And the npm package is installed:
```bash
npm install razorpay
```

## How It Works

### Payment Flow
1. **User clicks "Place Order & Pay"** → Frontend validates form
2. **Create Razorpay Order** → Backend creates order via Razorpay API
3. **Open Payment Modal** → Razorpay checkout opens with payment options
4. **User completes payment** → Razorpay processes payment
5. **Verify Payment** → Backend verifies payment signature
6. **Create Order** → Order is saved to database with payment details
7. **Redirect to Success** → User sees order confirmation

### Supported Payment Methods
- Credit/Debit Cards
- UPI
- Net Banking
- QR Code
- Wallets

## Testing

### Test Credentials
Use these test card details for testing:

**Card Payment:**
- Card Number: `4111 1111 1111 1111`
- Expiry: `12/25`
- CVV: `123`
- Name: `Test User`

**UPI Payment:**
- UPI ID: `success@razorpay`

### Test the Integration
1. Start your backend server
2. Start your frontend development server
3. Add items to cart
4. Go to checkout
5. Fill shipping details
6. Click "Place Order & Pay"
7. Complete payment with test credentials
8. Verify order is created and payment status is updated

## API Endpoints

### Create Payment Order
```
POST /payments/create-order
```
**Request Body:**
```json
{
  "amount": 1000,
  "currency": "INR",
  "receipt": "order_123"
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "order_xyz",
    "amount": 100000,
    "currency": "INR"
  },
  "keyId": "rzp_test_xxx"
}
```

### Verify Payment
```
POST /payments/verify
```
**Request Body:**
```json
{
  "razorpay_order_id": "order_xyz",
  "razorpay_payment_id": "pay_abc",
  "razorpay_signature": "signature",
  "orderData": { /* order details */ }
}
```

## Database Changes

### Order Model Updates
The Order model now includes:
- `razorpayPaymentId`: Razorpay payment ID
- `razorpayOrderId`: Razorpay order ID
- `paymentStatus`: Payment status (pending/completed/failed)

## Error Handling

### Common Issues
1. **Invalid API Keys**: Check your Razorpay credentials in `.env`
2. **Signature Verification Failed**: Ensure crypto module is imported
3. **Payment Modal Not Opening**: Check if Razorpay script is loaded
4. **CORS Issues**: Ensure CORS is configured for your frontend URL

### Error Messages
- Payment verification failed
- Failed to create payment order
- Invalid payment signature

## Production Deployment

### Switch to Live Mode
1. Get Live API credentials from Razorpay dashboard
2. Update `.env` with live credentials
3. Test thoroughly with live credentials
4. Update success/failure URLs if needed

### Security Considerations
- Never expose Razorpay secret key on frontend
- Always verify payment signatures on backend
- Use HTTPS in production
- Validate all payment data

## Support

For Razorpay integration issues:
- Check [Razorpay Documentation](https://razorpay.com/docs/)
- Test with Razorpay's test credentials
- Check server logs for detailed error messages

## Files Modified

### Backend
- `models/Order.js`: Added Razorpay fields
- `routes/payments.js`: Updated with real Razorpay integration
- `.env`: Added Razorpay configuration

### Frontend
- `src/pages/Checkout.jsx`: Integrated Razorpay checkout
- `src/services/api.js`: Updated payment service methods
- `index.html`: Added Razorpay script

## Next Steps

1. Test the integration with test credentials
2. Customize the payment modal appearance
3. Add payment retry functionality
4. Implement refund handling
5. Add payment webhook verification