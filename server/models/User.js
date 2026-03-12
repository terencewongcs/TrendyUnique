const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['Vendor', 'Customer'],
    required: true,
    default: 'customer'
  },
  instance: {
    type: mongoose.Schema.Types.ObjectId,
    // set the ref based on the role
    refPath: 'role'
    // ref: this.role === 'Vendor' ? 'Vendor' : 'Customer'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;