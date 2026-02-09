const express = require("express");
const router = express.Router();
const Product = require("../models/product_model");
const { productSchema } = require("../utils/validationSchema");
const verifyTokenAndUser = require("../middleware/verifyTokenAndUser");
const isSeller = require("../middleware/isSeller");

// Get all products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error });
  }
});

// Add a product
router.post("/products", verifyTokenAndUser, async (req, res) => {
  const user = req.user;
  const { error } = productSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }

  const {
    title,
    price,
    brand,
    category,
    description,
    thumbnail,
    images = [],
  } = req.body;

  try {
    const count = await Product.countDocuments();
    const doc = await Product.create({
      id: count + 1,
      title,
      price,
      brand,
      category,
      description,
      images,
      thumbnail,
      dimensions: [],
      sellerId: user._id,
      sellerName: user.name,
    });

    return res.status(201).json(doc);
  } catch (err) {
    console.error("Create product error:", err);
    return res.status(500).json({ message: "Failed to create product" });
  }
});

// Get a single product
router.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: "Product not found" });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Get user products (seller)
router.get("/user/products", verifyTokenAndUser, isSeller, async (req, res) => {
  try {
    const userId = req.user.id;
    const products = await Product.find({ sellerId: userId });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ msg: `Error getting user products: ${err}` });
  }
})

// Change product
router.patch("/products/:id", verifyTokenAndUser, isSeller, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    const { title, price, description } = req.body;
    if (title !== undefined) product.title = title;
    if (price !== undefined) product.price = price;
    if (description !== undefined) product.description = description;
    await product.save();
    res.status(200).json({ msg: "Product modified", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error editing product" });
  }
});

// Delete product
router.delete("/products/:id", verifyTokenAndUser, isSeller, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    await product.deleteOne();

    res.status(200).json({ msg: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error deleting product" });
  }
});

module.exports = router;
