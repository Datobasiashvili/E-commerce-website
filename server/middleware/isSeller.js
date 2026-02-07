const Product = require("../models/product_model");

const isSeller = async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    if(product.sellerId.toString() !== req.user.id){
        return res.status(403).json({ message: "Not allowed" });
    }

    next();
}

module.exports = isSeller;