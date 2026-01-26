const express = require("express");
const router = express.Router();
const verifyTokenAndUser = require("../middleware/verifyTokenAndUser");
const Review = require("../models/review_model");
const { reviewSchema } = require("../utils/validationSchema");


//Getting reviews for a single product
router.get("/products/:productId/reviews", async (req, res) => {
    const { productId } = req.params;

    try {
        // Sorts the reviews by the newest ones.
        const reviews = await Review.find({ productId })

        return res.status(200).json(reviews);
    } catch (err) {
        console.error("Get reviews error:", err);
        return res.status(500).json({ message: "Failed to fetch reviews" });
    }
});

//Adding a review.
router.post("/reviews/:productId", verifyTokenAndUser, async (req, res) => {
    try {
        const { error } = reviewSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ msg: error.details[0].message });
        }

        const { comment, rating } = req.body;
        const productId = req.params.productId;

        const existing = await Review.findOne({ productId, userId: req.user._id });
        if (existing) {
            return res.status(400).json({ msg: "You have already reviewed this product." });
        }

        const review = await Review.create({
            productId,
            userId: req.user._id,
            username: req.user.name,
            comment,
            rating
        });

        return res.status(201).json(review);

    } catch (err) {
        console.error("Add review error:", err);
        return res.status(500).json({ message: "Failed to add a review" });
    }
});

module.exports = router;