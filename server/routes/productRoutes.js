const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { writeLimiter } = require("../middlewares/rateLimit");

// Paths here are RELATIVE to where this router is mounted in index.js
// (mounted at /api/products, so "/" here becomes /api/products)
// Reads sirf global limiter ke neeche; writes DB par mehngi hain isliye alag.
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", writeLimiter, createProduct);
router.put("/:id", writeLimiter, updateProduct);
router.delete("/:id", writeLimiter, deleteProduct);

module.exports = router;
