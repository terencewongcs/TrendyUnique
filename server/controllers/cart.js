const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");
const Customer = require("../models/Customer");
const Admin = require("../models/Admin");

const calculateTotalPrice = (items) => {
  return items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
};

const getAllProductsFromCart = async (req, res) => {
  if (!req.user || (req.user.role !== "Customer" && req.user.role !== "Admin"))
    return res.status(401).json({ message: "No token, authorization denied" });

  // user instance id
  const userId = req.user._id;
  try {
    let cart;
    if (req.user.role === "Admin") {
      const admin = await Admin.findById(userId);
      if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
      }
      cart = await Cart.findById(admin.cart).populate("items.product");
    } else {
      const customer = await Customer.findById(userId);
      console.log(customer);
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      cart = await Cart.findById(customer.cart).populate("items.product");
    }
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    cart.totalPrice = calculateTotalPrice(cart.items);

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const addOneProductToCart = async (req, res) => {
  // only customer or admin can add product to cart
  if (!req.user || (req.user.role !== "Customer" && req.user.role !== "Admin"))
    return res.status(401).json({ message: "No token, authorization denied" });

  const userId = req.user._id;
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found." });
    }

    if (product.quantity < 1) {
      return res
        .status(404)
        .json({ message: "Insufficient product quantity." });
    }

    let cart;
    if (req.user.role === "Admin") {
      const admin = await Admin.findById(userId);
      if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
      }
      cart = await Cart.findById(admin.cart).populate("items.product");
    } else {
      const customer = await Customer.findById(userId);
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      cart = await Cart.findById(customer.cart).populate("items.product");
    }

    if (!cart) {
      return res.status(404).json({ message: "Cart not found for this user." });
    }

    const existingProductIndex = cart.items.findIndex((item) =>
      item.product.equals(productId)
    );

    if (existingProductIndex !== -1) {
      if (cart.items[existingProductIndex].quantity >= product.quantity) {
        return res
          .status(400)
          .json({ message: "Insufficient product quantity." });
      }
      cart.items[existingProductIndex].quantity += 1;
    } else {
      cart.items.push({ product: product, quantity: 1 });
    }

    cart.totalPrice = calculateTotalPrice(cart.items);

    await cart.save();

    res.status(201).json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const updateOneProductInCart = async (req, res) => {
  if (!req.user || (req.user.role !== "Customer" && req.user.role !== "Admin"))
    return res.status(401).json({ message: "No token, authorization denied" });

  const userId = req.user._id;
  const { productId } = req.params;
  const { quantity } = req.body;

  console.log(req.body);

  try {
    const product = await Product.findById(productId);

    if (!quantity || quantity < 1) {
      return res.status(404).json({ message: "Please input valid quantity." });
    }

    if (product.quantity < quantity) {
      return res
        .status(404)
        .json({ message: "Insufficient product quantity." });
    }

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found." });
    }

    let cart;

    if (req.user.role === "Admin") {
      const admin = await Admin.findById(userId);
      if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
      }
      cart = await Cart.findById(admin.cart).populate("items.product");
    } else {
      const customer = await Customer.findById(userId);
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      cart = await Cart.findById(customer.cart).populate("items.product");
    }

    if (!cart) {
      return res.status(404).json({ message: "Cart not found for this user." });
    }

    const existingProductIndex = cart.items.findIndex((item) =>
      item.product.equals(productId)
    );

    if (existingProductIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart." });
    }

    cart.items[existingProductIndex].quantity = quantity;

    cart.totalPrice = calculateTotalPrice(cart.items);

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const deleteOneProductInCart = async (req, res) => {
  if (!req.user || (req.user.role !== "Customer" && req.user.role !== "Admin"))
    return res.status(401).json({ message: "No token, authorization denied" });

  const userId = req.user._id;
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found." });
    }

    let cart;

    if (req.user.role === "Admin") {
      const admin = await Admin.findById(userId);
      if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
      }
      cart = await Cart.findById(admin.cart).populate("items.product");
    } else {
      const customer = await Customer.findById(userId);
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      cart = await Cart.findById(customer.cart).populate("items.product");
    }
    
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const existingProductIndex = cart.items.findIndex((item) =>
      item.product.equals(productId)
    );

    if (existingProductIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart." });
    }

    const updatedItems = cart.items.filter(
      (item) => !item.product.equals(productId)
    );
    cart.items = updatedItems;

    cart.totalPrice = calculateTotalPrice(cart.items);

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllProductsFromCart,
  addOneProductToCart,
  updateOneProductInCart,
  deleteOneProductInCart,
};
