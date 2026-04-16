const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET;

// REGISTER
exports.register = async (data) => {
  const { username, password, store_id } = data;
  if (!username || !password) {
    throw new Error("Missing username or password");
  }

  const hash = await bcrypt.hash(password, 10);

  // 🔥 LUÔN LÀ STAFF
  const userRole = "staff";

  await db.query(
    "INSERT INTO users (username, password, role, store_id) VALUES (?, ?, ?, ?)",
    [username, hash, "staff", store_id || 1],
  );

  return { message: "Register success" };
};

// LOGIN
exports.login = async (data) => {
  const { username, password } = data;

  const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [
    username,
  ]);

  if (rows.length === 0) {
    throw new Error("User not found");
  }

  const user = rows[0];

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Wrong password");
  }

  const token = jwt.sign(
    { id: user.id, role: user.role, store_id: user.store_id },
    SECRET,
    {
      expiresIn: "1d",
    },
  );

  return {
    message: "Login success",
    token,
  };
};
