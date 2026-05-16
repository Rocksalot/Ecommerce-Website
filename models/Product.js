const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Beauty', 'Books', 'Toys', 'Other'],
    default: 'Other'
  },
  image: {
    type: String,
    default: '/images/placeholder.jpg'
  },
  description: {
    type: String,
    default: ''
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  badge: {
    type: String,
    enum: ['New', 'Sale', 'Hot', 'Featured', ''],
    default: ''
  }
}, { timestamps: true });

// Text index for search
productSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);
