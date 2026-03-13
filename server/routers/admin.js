const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Joi = require('joi');
const auth = require('../middlewares/auth');
const requireRole = require('../middlewares/requireRole');
const Product = require('../models/Product');
const Order = require('../models/Order');

const productSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  category: Joi.string().required(),
  price: Joi.number().required(),
  quantity: Joi.number().required(),
  image: Joi.string().required()
});

const productUpdateSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  category: Joi.string(),
  price: Joi.number(),
  quantity: Joi.number(),
  image: Joi.string()
});

// All admin routes require auth + Admin role
router.use(auth, requireRole('Admin'));

// GET /api/admin/products — list ALL products
router.get('/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const sortField = req.query.sortField || 'createdAt';
    const sortOrder = parseInt(req.query.sortOrder) || -1;
    const search = req.query.search || '';

    const filter = {};
    if (search) {
      filter.$or = [{ name: new RegExp(search, 'i') }];
    }

    const data = await Product.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const total = await Product.countDocuments(filter);

    res.json({ data, page, pageSize, pages: Math.ceil(total / pageSize), total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/products — create product
router.post('/products', async (req, res) => {
  try {
    const params = await productSchema.validateAsync(req.body);
    params.owner = req.user._id;
    const product = new Product(params);
    await product.save();
    res.status(201).json({ id: product._id, message: 'Product created successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// PATCH /api/admin/products/:id — update any product
router.patch('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const params = await productUpdateSchema.validateAsync(req.body);
    await Product.findByIdAndUpdate(req.params.id, params);
    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/admin/products/:id — delete any product
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/orders — list ALL orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('items.product')
      .populate('customer', 'username email');
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/admin/orders/:id — update any order status
router.patch('/orders/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Delivering', 'Delivered'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = status;
    await order.save();
    res.json({ message: 'Order status updated', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
