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
  let { name, price, description, store_id } = data;

  // cho service tự bảo vệ bản thân hẹ hẹ
  name = name?.trim();

  if (!name || name.length === 0) {
    throw new Error("Product name is required");
  }

  if (!Number.isFinite(price) || price <= 0) {
    throw new Error("Invalid price");
  }

  if (!Number.isInteger(Number(store_id))) {
    throw new Error("Invalid store_id");
  }

  const [result] = await db.query(
    "INSERT INTO products (name, price, description, store_id) VALUES (?, ?, ?, ?)",
    [name, price, description || null, store_id],
  );

  return {
    message: "Created product",
    id: result.insertId,
  };
};

// UPDATE PRODUCT
exports.update = async (id, data) => {
  let { name, price, description, store_id } = data;

  // VALIDATE ID + STORE_ID
  if (!Number.isInteger(Number(id))) {
    throw new Error("Invalid product id");
  }

  if (!Number.isInteger(Number(store_id))) {
    throw new Error("Invalid store_id");
  }

  let query = "UPDATE products SET ";
  let updates = [];
  let params = [];

  // VALIDATE NAME
  if (name !== undefined) {
    name = name?.trim();

    if (!name) {
      throw new Error("Product name cannot be empty");
    }

    updates.push("name=?");
    params.push(name);
  }

  // VALIDATE PRICE
  if (price !== undefined) {
    if (!Number.isFinite(price) || price <= 0) {
      throw new Error("Invalid price");
    }

    updates.push("price=?");
    params.push(price);
  }

  // CLEAN DESCRIPTION
  if (description !== undefined) {
    description = description?.trim() || null;

    updates.push("description=?");
    params.push(description);
  }

  // safety
  if (updates.length === 0) {
    throw new Error("No fields to update");
  }

  query += updates.join(", ");

  // WHERE
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
