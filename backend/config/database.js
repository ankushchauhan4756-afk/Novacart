import mongoose from 'mongoose'
import { config } from './config.js'

export const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('MongoDB Connected Successfully')
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message)
    process.exit(1)
  }
}

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect()
    console.log('MongoDB Disconnected')
  } catch (error) {
    console.error('MongoDB Disconnection Error:', error.message)
  }
}

export default connectDB
