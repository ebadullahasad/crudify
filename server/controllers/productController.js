const Product = require("../models/product");

// GET /api/products — list all products (newest first)
const getAllProducts = async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.status(200).json(products);
};

// GET /api/products/:id — fetch one product by id
const getProductById = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    const err = new Error("Product not found with id: " + id);
    err.status = 404;
    throw err;
  }
  res.status(200).json(product);
};

// POST /api/products — create a new product
const createProduct = async (req, res) => {
  const { name } = req.body || {};
  if (!name) {
    const err = new Error("name key is required in the request body");
    err.status = 400;
    throw err;
  }
  const newProduct = new Product({ name });
  await newProduct.save();
  res.status(201).json({ message: newProduct.name + " is added to the list" });
};

// PUT /api/products/:id — update an existing product
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
  if (!updatedProduct) {
    const err = new Error("Product not found with id: " + id);
    err.status = 404;
    throw err;
  }
  res.status(200).json({ message: updatedProduct.name + " is updated" });
};

// DELETE /api/products/:id — delete a product
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    const err = new Error("Product not found with id: " + id);
    err.status = 404;
    throw err;
  }
  res.status(200).json({ message: product.name + " is deleted from the list" });
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
