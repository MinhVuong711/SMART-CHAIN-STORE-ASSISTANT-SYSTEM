require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const productRoutes = require("./routes/product.routes");
app.use("/", productRoutes);

app.listen(3002, () => {
  console.log("Product service running on port 3002");
});
