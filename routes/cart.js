const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const mongoose = require('mongoose');

// Helper: get cart from session
function getCart(req) {
  if (!req.session.cart) req.session.cart = [];
  return req.session.cart;
}

// GET cart page
router.get('/', async (req, res) => {
  try {
    const cart = getCart(req);
    let cartItems = [];
    let savedItems = [];

    if (mongoose.connection.readyState === 1 && cart.length > 0) {
      const productIds = cart.map(i => i.productId);
      const products = await Product.find({ _id: { $in: productIds } }).lean();

      cartItems = cart
        .filter(i => !i.savedForLater)
        .map(item => {
          const product = products.find(p => p._id.toString() === item.productId);
          return product ? { ...item, product } : null;
        })
        .filter(Boolean);

      savedItems = cart
        .filter(i => i.savedForLater)
        .map(item => {
          const product = products.find(p => p._id.toString() === item.productId);
          return product ? { ...item, product } : null;
        })
        .filter(Boolean);
    }

    const subtotal = cartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    const discount = subtotal > 100 ? 60 : 0;
    const tax = subtotal * 0.01;
    const total = subtotal - discount + tax;

    res.render('cart', {
      title: 'My Cart - ShopHub',
      cartItems,
      savedItems,
      subtotal,
      discount,
      tax,
      total,
      cartCount: cartItems.length
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not load cart.');
    res.redirect('/');
  }
});

// POST add to cart
router.post('/add', async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const cart = getCart(req);
  const existing = cart.find(i => i.productId === productId && !i.savedForLater);

  if (existing) {
    existing.quantity += parseInt(quantity);
  } else {
    cart.push({ productId, quantity: parseInt(quantity), savedForLater: false });
  }

  req.flash('success', 'Added to cart!');
  res.redirect('back');
});

// POST update quantity
router.post('/update', (req, res) => {
  const { productId, quantity } = req.body;
  const cart = getCart(req);
  const item = cart.find(i => i.productId === productId && !i.savedForLater);
  if (item) item.quantity = Math.max(1, parseInt(quantity));
  res.redirect('/cart');
});

// POST remove item
router.post('/remove', (req, res) => {
  const { productId } = req.body;
  req.session.cart = getCart(req).filter(i => i.productId !== productId);
  req.flash('success', 'Item removed.');
  res.redirect('/cart');
});

// POST save for later
router.post('/save-later', (req, res) => {
  const { productId } = req.body;
  const cart = getCart(req);
  const item = cart.find(i => i.productId === productId);
  if (item) item.savedForLater = true;
  res.redirect('/cart');
});

// POST move to cart
router.post('/move-to-cart', (req, res) => {
  const { productId } = req.body;
  const cart = getCart(req);
  const item = cart.find(i => i.productId === productId);
  if (item) item.savedForLater = false;
  res.redirect('/cart');
});

// POST remove all
router.post('/clear', (req, res) => {
  req.session.cart = [];
  res.redirect('/cart');
});

module.exports = router;
