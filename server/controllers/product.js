const Product = require("../models/Product");
const Vendor = require("../models/Vendor");
const Admin = require("../models/Admin");
const mongoose = require("mongoose");
const Joi = require("joi");

const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const sortField = req.query.sortField || "createdAt";
    const sortOrder = parseInt(req.query.sortOrder); // 'asc' ? 1 : -1;
    const search = req.query.search || "";

    if (page <= 0) return res.status(400).json({ message: "Invalid page" });
    if (pageSize <= 0)
      return res.status(400).json({ message: "Invalid page size" });

    // search by name
    let filter = {};
    if (search) {
      const regex = new RegExp(search, "i");
      filter = {
        $or: [{ name: regex }],
      };
    }

    // vendor or customer
    if (req.user && req.user !== "anonymous" && req.user.role === "Vendor") {
      filter["owner"] = new mongoose.Types.ObjectId(req.user._id);
    }

    const data = await Product.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();

    const total = await Product.countDocuments(filter);
    const pages = Math.ceil(total / pageSize);

    res.status(200).json({
      data,
      page,
      pageSize,
      pages,
      total,
    });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: e.message });
  }
};

const createProduct = async (req, res) => {
  const params = req.body;
  console.log(req.use);
  if (!req.user || req.user === "anonymous")
    return res.status(401).json({ message: "No token, authorization denied" });

  const schema = Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    category: Joi.string(),
    price: Joi.number(),
    quantity: Joi.number(),
    image: Joi.string(),
    owner: Joi.string(),
  });

  try {
    // create product by admin
    if (req.user.role === "Admin") {
      const ID = new mongoose.Types.ObjectId(req.user._id);
      const admin = await Admin.findById(ID);
      if (!admin) return res.status(400).json({ message: "No a valid admin" });
    } else if (req.user.role === "Vendor") {
      const ID = new mongoose.Types.ObjectId(req.user._id);
      const vendor = await Vendor.findById(ID);
      if (!vendor)
        return res.status(400).json({ message: "No a valid vendor" });
    } else {
      return res.status(401).json({ message: "Authorization denied" });
    }

    params.owner = req.user._id;
    await schema.validateAsync(params);

    const product = new Product(params);
    await product.save();
    res
      .status(200)
      .json({ id: product._id, message: "Create product successfully" });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: e.message });
  }
};

const updateProduct = async (req, res) => {
  if (!req.user || req.user === "anonymous")
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const { id } = req.params;
    const params = req.body;

    const ID = new mongoose.Types.ObjectId(id);
    const product = await Product.findById(ID);

    if (req.user.role !== "Admin" && product.owner.toString() !== req.user._id)
      return res.status(401).json({ message: "Authorization denied" });

    if (params.hasOwnProperty("owner")) delete params["owner"];
    await Product.findByIdAndUpdate(ID, params);
    res.status(200).json({ message: "Update product successfully" });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: e.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const ID = new mongoose.Types.ObjectId(id);
    const data = await Product.findById(ID);
    res.status(200).json(data);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: e.message });
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  getProduct,
};
