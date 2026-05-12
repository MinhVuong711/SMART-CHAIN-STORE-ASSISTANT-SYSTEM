require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
// app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    service: "gateway-service",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// load proxy routes
require("./routes/proxy")(app);

app.get("/", (req, res) => {
  res.json({ message: "API Gateway running" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Gateway running on port ${PORT}`);
});
