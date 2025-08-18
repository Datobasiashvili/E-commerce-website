const express = require("express");
const router = express.Router();
const userSchema = require("../utils/validationSchema");
const bcrypt = require("bcrypt");
const User = require("../models/mongoose_models");
const generateTokenAndSetCookie = require("../utils/generateTokenAndSetCookie");

// User registration
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

    //Setting an authentication JWT token to the user
    generateTokenAndSetCookie(res, newUser._id);

    //Sending user data to the front-end to know if the user is authenticated and display content based on that.
    res.status(201).json({
      msg: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});


// User login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("request body");
  console.log(email)
  console.log(password);

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ msg: "Invalid email" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ msg: "Wrong password" });
    }

    generateTokenAndSetCookie(res, user._id);

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      msg: "Logged in successfully",
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Error in login", err);
    res.status(400).json({ msg: err.message });
  }
});

module.exports = router;
