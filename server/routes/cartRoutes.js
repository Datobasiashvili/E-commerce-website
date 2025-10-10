const express = require("express");
const router = express.Router();
const verifyTokenAndUser = require("../middleware/verifyTokenAndUser");

//Add products to the cart or increase their quantity
router.post("/cart/add", verifyTokenAndUser , async (req, res) => {
  const user = req.user;
  const { product } = req.body;

  try {
    const existingProduct = user.cart.find((item) => item._id === product._id);

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

//Decrease product's quantity in the cart or delete it fully
router.patch("/cart/decrease", verifyTokenAndUser, async (req, res) => {
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
      (item) => item._id.toString() === productId
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
      user.markModified("cart"); 
    } else {
      user.cart = user.cart.filter((item) => item._id.toString() !== productId);
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


//Delete the product from the cart
router.delete("/cart/delete", verifyTokenAndUser ,async (req, res) => {
  const user = req.user;
  const { product } = req.body;

  try {
    user.cart = user.cart.filter(
      (item) => item._id !== product._id
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

//Get products from the cart
router.get("/cart/products", verifyTokenAndUser, async (req, res) => {
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
