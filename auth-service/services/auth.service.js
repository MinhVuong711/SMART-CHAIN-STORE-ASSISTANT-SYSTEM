const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
  throw new Error("JWT_SECRET is missing");
}

// REGISTER
exports.register = async (data) => {
  let { username, password, store_id } = data;

  username = username?.trim();
  password = password?.trim();

  if (!username || !password) {
    throw new Error("Missing username or password");
  }

  // BẮT BUỘC store_id
  if (!Number.isInteger(Number(store_id))) {
    throw new Error("Invalid store_id");
  }

  const hash = await bcrypt.hash(password, 10);

  try {
    await db.query(
      "INSERT INTO users (username, password, role, store_id) VALUES (?, ?, ?, ?)",
      [username, hash, "staff", Number(store_id)],
    );
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      throw new Error("Username already exists");
    }
    throw err;
  }

  return { message: "Register success" };
};

// LOGIN
exports.login = async (data) => {
  let { username, password } = data;

  username = username?.trim();
  password = password?.trim();

  const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [
    username,
  ]);

  if (rows.length === 0) {
    throw new Error("Invalid credentials");
  }

  const user = rows[0];
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
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
