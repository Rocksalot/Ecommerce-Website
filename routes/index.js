const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Home page
router.get('/', async (req, res) => {
  try {
    let featured = [], newArrivals = [], categories = [];

    // Only query DB if mongoose is connected
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1) {
      featured = await Product.find({ featured: true }).limit(8).lean();
      newArrivals = await Product.find({ badge: 'New' }).sort({ createdAt: -1 }).limit(8).lean();
      categories = await Product.distinct('category');
    }

    res.render('index', {
      title: 'ShopHub - Best Online Store',
      featured,
      newArrivals,
      categories
    });
  } catch (err) {
    console.error(err);
    res.render('index', {
      title: 'ShopHub - Best Online Store',
      featured: [],
      newArrivals: [],
      categories: []
    });
  }
});

module.exports = router;
