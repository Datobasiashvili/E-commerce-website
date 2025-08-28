const express = require("express");
const router = express.Router();
const Product = require("../models/product_model");
const User = require("../models/user_model");
const jwt = require("jsonwebtoken");
const { productSchema } = require("../utils/validationSchema");
const verifyTokenAndUser = require("../middleware/verifyTokenAndUser");

// Get all the products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error });
  }
});


// Add product to the database
router.post("/products", verifyTokenAndUser, async (req, res) => {
  const user = req.user
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
      email: user.email
    });

    return res.status(201).json(doc);
  } catch (err) {
    console.error("Create product error:", err);
    return res.status(500).json({ message: "Failed to create product" });
  }
});


// Get a single product:
router.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: "Product not found" });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
})

module.exports = router;
