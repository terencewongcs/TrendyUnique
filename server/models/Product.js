const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
    immutable: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
