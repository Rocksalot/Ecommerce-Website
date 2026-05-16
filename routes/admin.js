const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { isAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Multer config for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/images/products/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    cb(null, allowed.test(path.extname(file.originalname).toLowerCase()));
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

const fs = require('fs');
if (!fs.existsSync('public/images/products')) {
  fs.mkdirSync('public/images/products', { recursive: true });
}

// Admin dashboard
router.get('/', isAdmin, async (req, res) => {
  try {
    const [productCount, products] = await Promise.all([
      Product.countDocuments(),
      Product.find().sort({ createdAt: -1 }).limit(10).lean()
    ]);
    res.render('admin/dashboard', { title: 'Admin Dashboard - ShopHub', productCount, products });
  } catch (err) {
    req.flash('error', 'Could not load dashboard.');
    res.redirect('/');
  }
});

// Add product form
router.get('/products/new', isAdmin, (req, res) => {
  res.render('admin/product-form', {
    title: 'Add Product - ShopHub',
    product: null,
    action: '/admin/products'
  });
});

// POST create product
router.post('/products', isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, price, originalPrice, category, description, stock, featured, badge } = req.body;
    const image = req.file ? `/images/products/${req.file.filename}` : '/images/placeholder.jpg';
    await Product.create({
      name, price, originalPrice, category, description, stock,
      featured: featured === 'on',
      badge: badge || '',
      image
    });
    req.flash('success', 'Product added successfully!');
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to add product: ' + err.message);
    res.redirect('/admin/products/new');
  }
});

// Edit product form
router.get('/products/:id/edit', isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) { req.flash('error', 'Product not found.'); return res.redirect('/admin'); }
    res.render('admin/product-form', {
      title: 'Edit Product - ShopHub',
      product,
      action: `/admin/products/${product._id}?_method=PUT`
    });
  } catch (err) {
    req.flash('error', 'Could not load product.');
    res.redirect('/admin');
  }
});

// POST update product (method override via query)
router.post('/products/:id', isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, price, originalPrice, category, description, stock, featured, badge } = req.body;
    const update = { name, price, originalPrice, category, description, stock, featured: featured === 'on', badge: badge || '' };
    if (req.file) update.image = `/images/products/${req.file.filename}`;
    await Product.findByIdAndUpdate(req.params.id, update);
    req.flash('success', 'Product updated!');
    res.redirect('/admin');
  } catch (err) {
    req.flash('error', 'Update failed: ' + err.message);
    res.redirect('/admin');
  }
});

// DELETE product
router.post('/products/:id/delete', isAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    req.flash('success', 'Product deleted.');
  } catch (err) {
    req.flash('error', 'Delete failed.');
  }
  res.redirect('/admin');
});

module.exports = router;
