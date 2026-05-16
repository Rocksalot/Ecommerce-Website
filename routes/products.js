const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const mongoose = require('mongoose');

const ITEMS_PER_PAGE = 9;

// Product listing with search, filter, pagination
router.get('/', async (req, res) => {
  try {
    const { search, category, sort, page = 1 } = req.query;
    const currentPage = parseInt(page);
    let query = {};
    let sortOption = {};

    // Search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Sorting
    switch (sort) {
      case 'price-asc':   sortOption = { price: 1 }; break;
      case 'price-desc':  sortOption = { price: -1 }; break;
      case 'newest':      sortOption = { createdAt: -1 }; break;
      case 'rating':      sortOption = { rating: -1 }; break;
      default:            sortOption = { createdAt: -1 };
    }

    let products = [], totalProducts = 0, categories = [];

    if (mongoose.connection.readyState === 1) {
      totalProducts = await Product.countDocuments(query);
      products = await Product.find(query)
        .sort(sortOption)
        .skip((currentPage - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
        .lean();
      categories = await Product.distinct('category');
    }

    const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

    res.render('products', {
      title: 'Products - ShopHub',
      products,
      categories,
      currentPage,
      totalPages,
      totalProducts,
      search: search || '',
      selectedCategory: category || 'All',
      selectedSort: sort || 'newest'
    });
  } catch (err) {
    console.error(err);
    res.render('products', {
      title: 'Products - ShopHub',
      products: [],
      categories: [],
      currentPage: 1,
      totalPages: 0,
      totalProducts: 0,
      search: '',
      selectedCategory: 'All',
      selectedSort: 'newest'
    });
  }
});

// Single product detail
router.get('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.render('product-detail', { title: 'Product - ShopHub', product: null, related: [] });
    }

    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      req.flash('error', 'Product not found.');
      return res.redirect('/products');
    }

    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    }).limit(4).lean();

    res.render('product-detail', {
      title: `${product.name} - ShopHub`,
      product,
      related
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not load product.');
    res.redirect('/products');
  }
});

module.exports = router;
