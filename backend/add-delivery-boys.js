import mongoose from 'mongoose'
import User from './models/User.js'
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/novacart'

const deliveryBoys = [
  {
    name: 'Raj Kumar',
    email: 'raj.delivery@novacart.com',
    phone: '9876543210',
    password: 'password123', // Will be hashed by middleware
    role: 'deliveryBoy',
    status: 'active',
    address: {
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India'
    }
  },
  {
    name: 'Priya Singh',
    email: 'priya.delivery@novacart.com',
    phone: '9876543211',
    password: 'password123',
    role: 'deliveryBoy',
    status: 'active',
    address: {
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India'
    }
  },
  {
    name: 'Anil Patel',
    email: 'anil.delivery@novacart.com',
    phone: '9876543212',
    password: 'password123',
    role: 'deliveryBoy',
    status: 'active',
    address: {
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India'
    }
  }
]

async function addDeliveryBoys() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')

    // Check if delivery boys already exist
    const existingCount = await User.countDocuments({ role: 'deliveryBoy' })
    if (existingCount > 0) {
      console.log(`${existingCount} delivery boys already exist`)
      await mongoose.disconnect()
      return
    }

    // Add new delivery boys
    const result = await User.insertMany(deliveryBoys)
    console.log(`Added ${result.length} delivery boys:`)
    result.forEach(boy => {
      console.log(`  - ${boy.name} (${boy.email})`)
    })

    await mongoose.disconnect()
  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

addDeliveryBoys()
