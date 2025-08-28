const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  reviewerName: {
    type: String,
    required: true,
  },
  reviewerEmail: {
    type: String,
    required: true,
    lowercase: true,
  },
});

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
    images: [String],
    dimensions: {
      width: Number,
      height: Number,
      depth: Number,
    },
    rating: Number,
    reviews: [reviewSchema],
    stock: Number,
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
