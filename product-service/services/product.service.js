const db = require("../db");

// GET ALL
exports.getAll = async (store_id) => {
  const [rows] = await db.query(
    "SELECT * FROM products WHERE store_id=? ORDER BY id DESC",
    [store_id],
  );
  return rows;
};

// GET BY ID
exports.getById = async (id, store_id) => {
  const [rows] = await db.query(
    "SELECT * FROM products WHERE id=? AND store_id=?",
    [id, store_id],
  );

  return rows[0];
};

// CREATE PRODUCT
exports.create = async (data) => {
  const { name, price, description, store_id } = data;

  const [result] = await db.query(
    "INSERT INTO products (name, price, description, store_id) VALUES (?, ?, ?, ?)",
    [name, price, description, store_id],
  );

  return {
    message: "Created product",
    id: result.insertId,
  };
};

// UPDATE PRODUCT
exports.update = async (id, data) => {
  const { name, price, description, store_id } = data;

  let query = "UPDATE products SET ";
  let updates = [];
  let params = [];

  // chỉ update field được gửi
  if (name !== undefined) {
    updates.push("name=?");
    params.push(name);
  }

  if (price !== undefined) {
    updates.push("price=?");
    params.push(price);
  }

  if (description !== undefined) {
    updates.push("description=?");
    params.push(description);
  }

  // safety: tránh query lỗi
  if (updates.length === 0) {
    throw new Error("No fields to update");
  }

  query += updates.join(", ");

  // WHERE (không cho đổi store_id)
  query += " WHERE id=? AND store_id=?";
  params.push(id, store_id);

  const [result] = await db.query(query, params);

  return {
    message: "Updated",
    affectedRows: result.affectedRows,
  };
};

// DELETE PRODUCT
exports.remove = async (id, store_id) => {
  const [result] = await db.query(
    "DELETE FROM products WHERE id=? AND store_id=?",
    [id, store_id],
  );

  return {
    message: "Deleted",
    affectedRows: result.affectedRows,
  };
};
