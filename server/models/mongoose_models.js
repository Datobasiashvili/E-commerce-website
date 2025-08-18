const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"]
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true
        },
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        // Email / account verification, storing OTP for verification.
        verifyOtp: {
            type: String,
            default: ''
        },
        verifyOtpExpiredAt: {
            type: Number,
            default: 0
        },
        isAccountVerified: {
            type: Boolean,
            default: false
        },
        resetOtp: {
            type: String,
            default: ''
        },
        resetOtpExpiredAt: {
            type: Number,
            default: 0
        },
    }
)

const userModel = mongoose.models.user || mongoose.model('user', userSchema)
module.exports = userModel;
