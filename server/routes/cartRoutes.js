const express = require("express");
const router = express.Router();
const User = require("../models/mongoose_models");
const jwt = require("jsonwebtoken");

//Add products to the cart
router.post("/cart/add", async (req, res) => {
  const token = req.cookies.token;
  const { product } = req.body;
  if (!token) return res.status(401).send({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const existingProduct = user.cart.find(
      (item) => item.id.toString() === product.id.toString()
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
      user.markModified("cart");
    } else {
      user.cart.push({ ...product, quantity: 1 });
    }

    await user.save();

    return res
      .status(200)
      .json({ message: "Product added to cart", cart: user.cart });
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
});

//Get products from the cart
router.get("/cart/products", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).send({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ cartProducts: user.cart });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired, please log in again" });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
