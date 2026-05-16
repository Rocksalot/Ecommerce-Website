require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';

const products = [
  { name: 'T-shirts with multiple colors, for men', price: 10.30, originalPrice: 15.00, category: 'Fashion', description: 'Classic t-shirt available in multiple colors. Comfortable cotton fabric, perfect for everyday wear.', stock: 150, featured: true, badge: 'New', rating: 4.5, reviewCount: 32, image: '/images/web-main.jpg' },
  { name: 'Jeans shorts for men, blue color', price: 10.30, originalPrice: 18.00, category: 'Fashion', description: 'Casual blue denim shorts. Durable and stylish, ideal for summer outings.', stock: 85, featured: true, badge: 'Sale', rating: 4.2, reviewCount: 18, image: '/images/web-main.jpg' },
  { name: 'Brown winter coat medium size', price: 12.50, originalPrice: 25.00, category: 'Fashion', description: 'Warm and stylish brown winter coat. Water-resistant outer shell with fleece lining.', stock: 40, featured: true, badge: 'Hot', rating: 4.7, reviewCount: 54, image: '/images/web-main.jpg' },
  { name: 'Leather wallet for men', price: 34.00, originalPrice: 50.00, category: 'Fashion', description: 'Genuine leather bifold wallet. Multiple card slots and a spacious bill compartment.', stock: 200, featured: false, badge: '', rating: 4.8, reviewCount: 91, image: '/images/web-main.jpg' },
  { name: 'Backpack blue leather', price: 98.00, originalPrice: 120.00, category: 'Fashion', description: 'Premium blue leather backpack. Fits 15" laptop with multiple pockets for organization.', stock: 30, featured: true, badge: 'New', rating: 4.6, reviewCount: 27, image: '/images/web-main.jpg' },
  { name: 'GoPro HERO6 4K Action Camera', price: 99.50, originalPrice: 128.00, category: 'Electronics', description: 'Professional action camera with 4K video at 60fps, waterproof up to 33ft, voice control, and touch zoom.', stock: 60, featured: true, badge: 'Sale', rating: 4.5, reviewCount: 112, image: '/images/web-gridview.jpg' },
  { name: 'Wireless Headphones', price: 89.00, originalPrice: 130.00, category: 'Electronics', description: 'Premium over-ear wireless headphones. 30-hour battery, active noise cancellation, foldable design.', stock: 75, featured: true, badge: 'Hot', rating: 4.8, reviewCount: 204, image: '/images/web-gridview.jpg' },
  { name: 'Smart Watch Series X', price: 199.00, originalPrice: 250.00, category: 'Electronics', description: 'Advanced smartwatch with health monitoring, GPS, water resistance, and 7-day battery life.', stock: 45, featured: true, badge: 'New', rating: 4.9, reviewCount: 67, image: '/images/web-gridview.jpg' },
  { name: 'Laptop Pro 15"', price: 749.00, originalPrice: 999.00, category: 'Electronics', description: 'High-performance laptop with Intel i7, 16GB RAM, 512GB SSD. Perfect for professionals and creatives.', stock: 20, featured: true, badge: 'Sale', rating: 4.7, reviewCount: 45, image: '/images/web-gridview.jpg' },
  { name: 'Canon DSLR Camera', price: 499.00, originalPrice: 650.00, category: 'Electronics', description: 'Professional DSLR with 24MP sensor, dual pixel autofocus, 4K video, and Wi-Fi connectivity.', stock: 15, featured: false, badge: 'Hot', rating: 4.9, reviewCount: 88, image: '/images/web-gridview.jpg' },
  { name: 'Soft Chair Modern Design', price: 19.00, originalPrice: 35.00, category: 'Home & Garden', description: 'Comfortable ergonomic chair with soft cushioning. Modern design fits any living space.', stock: 50, featured: false, badge: '', rating: 4.3, reviewCount: 22, image: '/images/web-main.jpg' },
  { name: 'Kitchen Blender Pro', price: 39.00, originalPrice: 55.00, category: 'Home & Garden', description: 'Powerful 1200W blender with 8 speed settings and pulse mode. Perfect for smoothies and soups.', stock: 65, featured: false, badge: 'New', rating: 4.5, reviewCount: 41, image: '/images/web-main.jpg' },
  { name: 'Gaming Headset RGB', price: 35.00, originalPrice: 60.00, category: 'Electronics', description: '7.1 surround sound gaming headset with RGB lighting, noise-canceling microphone.', stock: 90, featured: false, badge: 'Sale', rating: 4.4, reviewCount: 76, image: '/images/web-gridview.jpg' },
  { name: 'Samsung Galaxy Smartphone', price: 499.00, originalPrice: 649.00, category: 'Electronics', description: 'Latest Samsung flagship with 6.7" AMOLED display, 108MP camera, 5G connectivity.', stock: 35, featured: true, badge: 'Hot', rating: 4.6, reviewCount: 130, image: '/images/web-gridview.jpg' },
  { name: 'Coffee Maker Deluxe', price: 10.00, originalPrice: 20.00, category: 'Home & Garden', description: 'Programmable coffee maker with 12-cup capacity, built-in grinder, and keep-warm function.', stock: 55, featured: false, badge: '', rating: 4.2, reviewCount: 33, image: '/images/web-main.jpg' },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await Product.deleteMany({});
    console.log('Cleared existing products');

    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products`);

    // Create admin user
    await User.deleteMany({ email: 'admin@shophub.com' });
    await User.create({
      name: 'Admin',
      email: 'admin@shophub.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log('Admin user created: admin@shophub.com / admin123');

    await mongoose.disconnect();
    console.log('Seeding complete!');
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  }
}

seed();
