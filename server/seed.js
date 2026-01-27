const mongoose = require("mongoose");
const Product = require("./models/product_model");
const axios = require("axios");

async function seedDatabase() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/E-commerce");

    await Product.deleteMany({});

    
    const { data } = await axios.get("https://dummyjson.com/products");
    console.log(data.products.map(p => p.id));
    const products = data.products;

    // Insert into MongoDB
    await Product.insertMany(products);

    console.log("Database seeded successfully!");
    mongoose.disconnect();
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seedDatabase();