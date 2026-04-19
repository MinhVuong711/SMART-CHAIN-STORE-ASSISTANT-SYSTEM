require("dotenv").config();

const express = require("express");
const cors = require("cors");

const storeRoutes = require("./routes/store.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/stores", storeRoutes);

app.get("/", (req, res) => {
  res.json({ service: "store-service running" });
});

app.listen(3005, () => {
  console.log("Store service running on port 3005");
});
