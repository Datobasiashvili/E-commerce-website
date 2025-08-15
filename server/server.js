const express = require("express");
const app = express();
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");

const corsOptions = {
    origin: ["http://localhost:5173"],
    credentials: true
}

app.use(express.json());
app.use("/api", authRoutes);
app.use(cors(corsOptions));



const port = process.env.PORT || "5000"

app.listen(5000, () => {
    console.log(`Server is listening on port ${port}`);
})