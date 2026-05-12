require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const customerRoutes = require("./routes/customer.routes");

app.use(express.json());
app.use(cors());

app.get("/health", (req, res) => {
  res.json({
    service: "customer-service",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.use("/customers", customerRoutes);

app.listen(3004, () => {
  console.log("Customer service running on port 3004");
});
