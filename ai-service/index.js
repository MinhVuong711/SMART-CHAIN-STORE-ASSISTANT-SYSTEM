require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const aiRoutes = require("./routes/ai.routes");
app.use("/ai", aiRoutes);

app.get("/", (req, res) => {
  res.json({ service: "ai-service running" });
});

const PORT = process.env.PORT || 3007;

app.listen(PORT, () => {
  console.log(`AI service running on port ${PORT}`);
});
