const mongoose = require("mongoose");
const Product = require("./models/product_model");
const axios = require("axios");

<<<<<<< HEAD

=======
>>>>>>> ddd6f5e2493fe3f07c819747f4d2599ccaa64c16
async function seedDatabase() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/E-commerce");

    await Product.deleteMany({});

    
    const { data } = await axios.get("https://dummyjson.com/products");
<<<<<<< HEAD
    console.log(data.products.map(p => p.id));
=======
>>>>>>> ddd6f5e2493fe3f07c819747f4d2599ccaa64c16
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