const Book = require('../models/Book');

exports.createBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json({ success: true, data: book });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'A book with that ISBN already exists.' });
    }
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: books.length, data: books });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ success: false, message: 'Book not found.' });
    res.status(200).json({ success: true, data: book });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!book) return res.status(404).json({ success: false, message: 'Book not found.' });
    res.status(200).json({ success: true, data: book });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ success: false, message: 'Book not found.' });
    res.status(200).json({ success: true, message: 'Book deleted successfully.' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};