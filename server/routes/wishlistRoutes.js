const express = require("express");
const router = express.Router();
const verifyTokenAndUser = require("../middleware/verifyTokenAndUser");

router.post("/wishlist", verifyTokenAndUser, async (req, res) => {
  const user = req.user;
  const { productId } = req.body;

  try {
    if (!user.wishlist) user.wishlist = [];

    const existingWishlistProduct = user.wishlist.find(
      (id) => id.toString() === productId.toString()
    );

    if (existingWishlistProduct) {
      return res.status(200).json({
        success: true,
        message: "Product is already in your wishlist",
      });
    }

    //We're saving only ID's in wishlist for less server lag.
    user.wishlist.push(productId);
    await user.save();

    res.status(201).json({
      success: true,
      message: "Product added to wishlist",
      wishlist: user.wishlist
    });
  } catch (err) {
    console.error(`Error: ${err}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//Gettin user's wishlist products
router.get("/wishlist", verifyTokenAndUser, async (req, res) => {
  try {
    const user = req.user;
    const wishlistIds = user.wishlist || [];
    return res.status(200).json({ wishlistIds });
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

//Deleting user's wishlist product
router.delete("/wishlist/:productId", verifyTokenAndUser, async (req, res) => {
  try {
    const user = req.user;
    const { productId } = req.params;
    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productId.toString()
    );
    await user.save();

    res.status(200).json({
      message: "Product removed from wishlist successfully",
      wishlist: user.wishlist,
    });

  } catch (err) {
    console.error('Adding to wishlist error:', err);
    res.status(500).json({ success: false, message: "Server error while removing the product from wishlist." });
  }

});

module.exports = router;
