const express = require("express");
const router = express.Router();
const Product = require("../models/product_model");
const { productSchema, reviewSchema } = require("../utils/validationSchema");
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

// Get a single product:
router.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: "Product not found" });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Get all reviews for a product:
router.get("/products/:id/reviews", verifyTokenAndUser, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(201).json(product.reviews);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Add a review on a product:
router.post("/products/:id/reviews", verifyTokenAndUser, async (req, res) => {
  try {
    const { error } = reviewSchema.validate(req.body);
    if (error) return res.status(400).json({ msg: error.details[0].message });

    const { comment, rating } = req.body;
    if (!comment || !rating) return res.status(400).json({ msg: "Comment and rating are required" });

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    const newReview = { comment, rating, reviewer: req.user._id };
    product.reviews.push(newReview);

    product.rating = product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;
    await product.save();

    await newReview.populate("reviewer", "name email");

    res.status(201).json({ msg: "Comment added successfully", review: newReview });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;
