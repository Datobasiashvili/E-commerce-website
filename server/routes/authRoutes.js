const express = require("express");
const router = express.Router();
const userSchema = require("../utils/validationSchema");
const bcrypt = require("bcrypt");
const User = require("../models/mongoose_models");

// User registration
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const { error } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .send({ msg: "User with this email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ msg: "User registered successfully!" })
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;
