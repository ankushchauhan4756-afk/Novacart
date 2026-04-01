import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      default: null,
    },
    category: {
      type: String,
      required: true,
      enum: ['fashion', 'clothes', 'tech-gadgets', 'fruits', 'vegetables', 'others'],
    },
    subcategory: String,
    image: {
      type: String,
      required: true,
    },
    images: [String],
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    specifications: {
      type: Map,
      of: String,
    },
    tags: [String],
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'discontinued'],
      default: 'active',
    },
    views: {
      type: Number,
      default: 0,
    },
    sales: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
)

// Text index for search
productSchema.index({ name: 'text', description: 'text', tags: 'text' })

export default mongoose.model('Product', productSchema)
