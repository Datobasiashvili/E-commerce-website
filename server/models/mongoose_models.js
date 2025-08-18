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
}, {timestamps: true });

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
module.exports = userModel;
