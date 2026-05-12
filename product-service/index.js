require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const productRoutes = require("./routes/product.routes");

app.get("/health", (req, res) => {
  res.json({
    service: "product-service",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.use("/", productRoutes);

app.listen(3002, () => {
  console.log("Product service running on port 3002");
});
