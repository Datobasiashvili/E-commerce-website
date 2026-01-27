const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: String,
    id: Number,
    description: String,
    price: Number,
    brand: String,
    category: String,
    warrantyInformation: String,
    thumbnail: String,
    images: {
      type: [String],
      default: [],
      required: true,
    },
    dimensions: {
      width: Number,
      height: Number,
      depth: Number,
    },
    rating: Number,
    // reviews: [reviewSchema],
    stock: Number,
    sellerName: String,
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: true }
);

const productModel = mongoose.model("product", productSchema, "product-data");
module.exports = productModel;
