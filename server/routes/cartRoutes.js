const express = require("express");
const router = express.Router();
const verifyTokenAndUser = require("../middleware/verifyTokenAndUser");
const User = require("../models/user_model.js");

//Add products to the cart or increase their quantity
router.post("/cart", verifyTokenAndUser, async (req, res) => {
  const { productId } = req.body;

  try {
    const result = await User.updateOne(
      { 
        _id: req.user._id,
        "cart.product": productId
      },
      {
        $inc: { "cart.$.quantity": 1 }
      }
    );

    if (result.matchedCount === 0) {
      await User.updateOne(
        { _id: req.user._id },
        { $push: { cart: { product: productId, quantity: 1 } } }
      );
    }

    const user = await User.findById(req.user._id);
    res.status(200).json({ message: "Product added to cart", cart: user.cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

//Decrease product's quantity in the cart or delete it fully - (for Home.jsx and Cart.jsx)
router.patch("/cart", verifyTokenAndUser, async (req, res) => {
  const user = req.user;
  const { productId } = req.body; 

  if (!productId) {
    return res.status(400).json({
      success: false,
      error: "MISSING_PRODUCT_ID",
      message: "Product ID is required to decrease quantity."
    });
  }

  try {
    const existingProduct = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        error: "PRODUCT_NOT_FOUND",
        message: "Product not found in the user's cart."
      });
    }

    if (existingProduct.quantity > 1) {
      existingProduct.quantity -= 1;
    } else {
      user.cart = user.cart.filter((item) => item.product.toString() !== productId);
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Product quantity decreased successfully",
      cart: user.cart
    });
  } catch (err) {
    console.error("Error decreasing cart product quantity:", err);
    return res.status(500).json({
      success: false,
      error: "SERVER_ERROR",
      message: "Failed to decrease product quantity in cart."
    });
  }
});


//Delete the product from the cart - (for Cart.jsx)
router.delete("/cart", verifyTokenAndUser ,async (req, res) => {
  const user = req.user;
  const { productId } = req.body;

  try {
    user.cart = user.cart.filter(
      (item) => item.product.toString() !== productId
    );
    await user.save();

    res.status(200).json({
      message: "Product removed from cart successfully",
      cart: user.cart,
    });
    
  } catch (err) {
    console.error(`Error: ${err}`);
    res.status(500).json({ message: "Server error" });
  }
});

//Get all the products from the cart
router.get("/cart", verifyTokenAndUser, async (req, res) => {
  const user = req.user
  try {
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
