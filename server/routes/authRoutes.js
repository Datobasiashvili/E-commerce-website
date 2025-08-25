const express = require("express");
const router = express.Router();
const userSchema = require("../utils/validationSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/mongoose_models");
const generateToken = require("../utils/generateToken");

// User registration / Sign up
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const { error } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).send({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });
    await newUser.save();

    const { password: pwd, ...userWithoutPassword } = newUser._doc;

    //Setting an authentication JWT token to the user
    const token = generateToken(newUser._id);

    //Sending user data to the front-end to know if the user is authenticated and display content based on that.
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(201)
      .json({
        msg: "User registered successfully",
        user: userWithoutPassword,
      });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// User login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ msg: "Invalid email" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ msg: "Wrong password" });
    }

    user.lastLogin = new Date();
    await user.save();

    const { password: pwd, ...userWithoutPassword } = user._doc;
    const token = generateToken(user._id);

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(200)
      .json({
        msg: "Logged in successfully",
        user: userWithoutPassword,
      });
  } catch (err) {
    console.error("Error in login", err);
    res.status(400).json({ msg: err.message });
  }
});

// Route that checks the cookie and sends the authenticated user to the frontend
router.get("/account", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password"); // exclude password
    if (!user)
      return res
        .status(404)
        .json({ isAuthenticated: false, message: "User not found" });

    res.json({ isAuthenticated: true, user });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

// Logout route
router.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
});

module.exports = router;
