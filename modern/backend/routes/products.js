const express = require('express');
const router = express.Router();
const pool = require('../db');
const { verifyToken } = require('../middleware/auth');

// GET /api/products
router.get('/', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM product');
    return res.status(200).json(rows);
  } catch (err) {
    console.error('Get products error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/products
router.post('/', verifyToken, async (req, res) => {
  const { product_name, price, quantity } = req.body;

  // Server-side validation
  if (!product_name || typeof product_name !== 'string' || product_name.trim().length === 0) {
    return res.status(400).json({ error: 'Product name is required' });
  }
  if (product_name.trim().length > 30) {
    return res.status(400).json({ error: 'Product name must be 30 characters or fewer' });
  }
  const parsedPrice = parseFloat(price);
  if (isNaN(parsedPrice) || parsedPrice <= 0) {
    return res.status(400).json({ error: 'Price must be a positive number' });
  }
  const parsedQty = parseInt(quantity, 10);
  if (!Number.isInteger(parsedQty) || parsedQty < 1) {
    return res.status(400).json({ error: 'Quantity must be an integer of at least 1' });
  }

  try {
    const [result] = await pool.execute(
      'INSERT INTO product (product_name, price, quantity) VALUES (?, ?, ?)',
      [product_name.trim(), parsedPrice, parsedQty]
    );

    return res.status(201).json({
      product_id: result.insertId,
      product_name: product_name.trim(),
      price: parsedPrice,
      quantity: parsedQty
    });
  } catch (err) {
    console.error('Add product error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
