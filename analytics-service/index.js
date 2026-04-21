require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const analyticsRoutes = require("./routes/analytics.routes");
app.use("/analytics", analyticsRoutes);

app.get("/", (req, res) => {
  res.json({ service: "analytics-service running" });
});

const PORT = process.env.PORT || 3006;

app.listen(PORT, () => {
  console.log(`Analytics service running on port ${PORT}`);
});
