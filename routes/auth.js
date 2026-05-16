const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');

// GET login
router.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('auth/login', { title: 'Login - ShopHub' });
});

// POST login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (mongoose.connection.readyState !== 1) {
      req.flash('error', 'Database unavailable. Please try again later.');
      return res.redirect('/auth/login');
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/auth/login');
    }
    req.session.user = { id: user._id, name: user.name, email: user.email, role: user.role };
    req.flash('success', `Welcome back, ${user.name}!`);
    res.redirect(req.session.returnTo || '/');
    delete req.session.returnTo;
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/auth/login');
  }
});

// GET signup
router.get('/signup', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('auth/signup', { title: 'Sign Up - ShopHub' });
});

// POST signup
router.post('/signup', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  try {
    if (password !== confirmPassword) {
      req.flash('error', 'Passwords do not match.');
      return res.redirect('/auth/signup');
    }
    if (mongoose.connection.readyState !== 1) {
      req.flash('error', 'Database unavailable. Please try again later.');
      return res.redirect('/auth/signup');
    }
    const existing = await User.findOne({ email });
    if (existing) {
      req.flash('error', 'Email already registered.');
      return res.redirect('/auth/signup');
    }
    const user = await User.create({ name, email, password });
    req.session.user = { id: user._id, name: user.name, email: user.email, role: user.role };
    req.flash('success', `Welcome, ${user.name}! Account created successfully.`);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Registration failed. Please try again.');
    res.redirect('/auth/signup');
  }
});

// GET logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
