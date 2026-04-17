require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const customerRoutes = require("./routes/customer.routes");

app.use(express.json());
app.use(cors());

app.use("/customers", customerRoutes);

app.listen(3004, () => {
  console.log("Customer service running on port 3004");
});
