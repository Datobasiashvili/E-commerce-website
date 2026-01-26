const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
<<<<<<< HEAD
  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      }
    }
  ],
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }

  ],
=======
  cart: {
    type: Array,
    default: []
  },
  wishlist: {
    type: [String]
  },
>>>>>>> ddd6f5e2493fe3f07c819747f4d2599ccaa64c16
  lastLogin: {
    type: Date,
    default: Date.now()
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: String,
  resetPasswordExpiresAt: Date,
  verificationToken: String, //User will get this token as an email and verify it with this code.
  verificationTokenExpiresAt: Date,
<<<<<<< HEAD
}, { timestamps: true });
=======
}, {timestamps: true });
>>>>>>> ddd6f5e2493fe3f07c819747f4d2599ccaa64c16

const userModel = mongoose.models.user || mongoose.model("User", userSchema, "users");
module.exports = userModel;
