const mongoose = require("mongoose");
const Product = require("./models/product_model");
const axios = require("axios");

async function seedDatabase() {
  try {
    const MONGOURL = process.env.MONGO_URL;
    await mongoose.connect(MONGOURL);

    await Product.deleteMany({});

    const { data } = await axios.get("https://dummyjson.com/products");
    console.log(data.products.map(p => p.id));
    const products = data.products.map(p => ({
      ...p,
      rating: 0,
      ratingCount: 0
    }));

    // Insert into MongoDB
    await Product.insertMany(products);

    console.log("Database seeded successfully!");
    mongoose.disconnect();
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seedDatabase();