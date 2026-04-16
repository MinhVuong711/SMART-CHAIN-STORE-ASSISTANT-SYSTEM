require("dotenv").config();

const express = require("express");
const cors = require("cors");

const orderRoutes = require("./routes/order.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/orders", orderRoutes);

app.listen(3003, () => {
  console.log("Order service running on port 3003");
});
