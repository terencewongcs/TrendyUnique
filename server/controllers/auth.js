const User = require("../models/User");
const Customer = require("../models/Customer");
const Vendor = require("../models/Vendor");
const Admin = require("../models/Admin");
const Cart = require("../models/Cart");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { SECRET_KEY } = process.env;

const userSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30).required(),
  role: Joi.string().valid("Vendor", "Customer", "Admin").required(),
  createdAt: Joi.date(),
});

const register = async (req, res) => {
  try {
    const { username, email, password, role } = await userSchema.validateAsync(
      req.body
    );
    // Check if the email is already in use
    const existing = await User.findOne({
      email,
    });
    if (existing) {
      return res.status(400).json({ message: "Email already in use!" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    let instance;
    if (role === "Vendor") {
      instance = new Vendor({
        username,
        email,
        products: [],
      });
    } else {
      const cart = new Cart({ items: [], totalPrice: 0 });
      await cart.save();
      instance = new Customer({
        username,
        email,
        cart: cart._id,
      });
    }
    await instance.save();
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role,
      instance: instance._id,
    });
    await user.save();
    const token = jwt.sign({ user: instance._id, role: user.role }, SECRET_KEY, {
      expiresIn: "24h",
    });
    const returnUser = { ...instance._doc };
    return res.status(201).json({ token, user: returnUser });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // if (email === "admin@chuwa.com" && password === "adminchuwa") {
    //   const admin = { _id: "admin", role: "Admin" };
    //   const token = jwt.sign({ user: admin._id, role: admin.role }, SECRET_KEY, {
    //     expiresIn: "24h",
    //   });
    //   return res.status(200).json({ token, user: admin });
    // }
    const user = await User.findOne({ email }).populate("instance");
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password!" });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid email or password!" });
    }

    const returnUser = { ...user.instance._doc };
    const token = jwt.sign({ user: user.instance._id, role: user.role }, SECRET_KEY, {
      expiresIn: "24h",
    });
    return res.status(200).json({ token, user: returnUser });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    const userId = req.user;
    const user = await User.findOne({ email }).populate("instance");
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password!" });
    }
    if (user.instance._id.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized!" });
    }
    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid email or password!" });
    }
    userSchema.validate({
      username: user.username,
      email,
      password: newPassword,
      role: user.role,
      createdAt: user.createdAt,
    });
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({ message: "Password updated successfully!" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

module.exports = { register, login, updatePassword };
