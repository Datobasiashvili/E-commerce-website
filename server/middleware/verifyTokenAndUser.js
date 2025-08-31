const User = require("../models/user_model");
const jwt = require("jsonwebtoken");

// Middleware to verify token and fetch user
const verifyTokenAndUser = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "TOKEN_MISSING",
      message: "No token provided. User verification failed in verifyTokenAndUser middleware."
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "USER_NOT_FOUND",
        message: "The user associated with this token does not exist in verifyTokenAndUser middleware."
      });
    }
    req.user = user;
    next(); // Proceed to the route handler
  } catch (err) {
    console.error("verifyTokenAndUser error:", err);

    return res.status(401).json({
      success: false,
      error: "TOKEN_INVALID",
      message: "Token is invalid or expired. User verification failed in verifyTokenAndUser middleware."
    });
  }
};

module.exports = verifyTokenAndUser;
