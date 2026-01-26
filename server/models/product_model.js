const mongoose = require("mongoose");

<<<<<<< HEAD
=======
//We'll add a review system later
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
    minlength: 3,
    maxlength: 500,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

>>>>>>> ddd6f5e2493fe3f07c819747f4d2599ccaa64c16
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
<<<<<<< HEAD
    // reviews: [reviewSchema],
=======
    reviews: [reviewSchema],
>>>>>>> ddd6f5e2493fe3f07c819747f4d2599ccaa64c16
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
