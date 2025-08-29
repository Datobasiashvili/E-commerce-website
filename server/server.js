const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser")
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const productRoutes = require("./routes/productRoutes")

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api", authRoutes);
app.use("/api", cartRoutes);
app.use("/api", productRoutes);

app.get("/", (req, res) => {
  res.send("Server is running!");
});


const MONGOURL = process.env.MONGO_URL;
mongoose
  .connect(MONGOURL)
  .then(() => console.log("MongoDB database connected"))
  .catch((err) => console.log(`Error ${err}`));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
