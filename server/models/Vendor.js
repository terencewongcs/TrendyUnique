const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
  },
  orders: [{
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
    },
    items: [{
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: Number,
    }],
    totalPrice: Number,
    status: {
      type: String,
      enum: ['Pending', 'Delivering', 'Delivered'],
      default: 'Pending',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    address: {
      type: String,
    },
  }],
});

const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;
