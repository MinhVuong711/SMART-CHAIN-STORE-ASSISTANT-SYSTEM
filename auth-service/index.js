require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ service: "auth-service running" });
});

const bcrypt = require("bcrypt");
const db = require("./db");

async function createDefaultAdmin() {
  const adminUsername = process.env.DEFAULT_ADMIN_USERNAME;
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword) {
    console.log("Default admin creation skipped: missing admin env config");
    return;
  }

  const [rows] = await db.query("SELECT * FROM users WHERE role = 'admin'");

  if (rows.length === 0) {
    const hash = await bcrypt.hash(adminPassword, 10);

    await db.query(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [adminUsername, hash, "admin"],
    );

    console.log("🔥 Default admin created");
  }
}

// Khởi tạo trước khi listen
(async () => {
  try {
    await createDefaultAdmin();
    app.listen(3001, () => {
      console.log("Auth service running on port 3001");
    });
  } catch (err) {
    console.error("❌ Failed to create default admin:", err);
    process.exit(1); // dừng service nếu lỗi
  }
})();
