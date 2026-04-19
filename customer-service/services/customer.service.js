const db = require("../db");

// CREATE
exports.create = async (data) => {
  let { name, phone, email, store_id } = data;

  // trim input
  name = name?.trim();
  phone = phone?.trim();
  email = email?.trim();

  // validate required
  if (!name || !phone) {
    throw new Error("Name and phone are required");
  }

  // validate format phone
  if (!/^[0-9]{9,11}$/.test(phone)) {
    throw new Error("Invalid phone format");
  }

  if (!Number.isInteger(Number(store_id))) {
    throw new Error("Invalid store_id");
  }

  try {
    const [result] = await db.query(
      "INSERT INTO customers (name, phone, email, store_id) VALUES (?, ?, ?, ?)",
      [name, phone, email || null, Number(store_id)],
    );

    return { id: result.insertId };
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      throw new Error("Phone already exists in this store");
    }
    throw err;
  }
};

// GET ALL
exports.getAll = async (store_id) => {
  if (store_id) {
    const [rows] = await db.query(
      "SELECT * FROM customers WHERE store_id = ?",
      [store_id],
    );
    return rows;
  } else {
    // admin
    const [rows] = await db.query("SELECT * FROM customers");
    return rows;
  }
};

// GET BY ID
exports.getById = async (id, store_id) => {
  if (store_id) {
    const [rows] = await db.query(
      "SELECT * FROM customers WHERE id = ? AND store_id = ?",
      [id, store_id],
    );
    return rows[0];
  } else {
    // admin
    const [rows] = await db.query("SELECT * FROM customers WHERE id = ?", [id]);
    return rows[0];
  }
};

//UPDATE
exports.update = async (id, data, store_id) => {
  let query = "UPDATE customers SET ";
  let updates = [];
  let params = [];

  if (data.name !== undefined) {
    updates.push("name=?");
    params.push(data.name.trim());
  }

  if (data.phone !== undefined) {
    updates.push("phone=?");
    params.push(data.phone.trim());
  }

  if (data.email !== undefined) {
    updates.push("email=?");
    params.push(data.email.trim());
  }

  if (updates.length === 0) {
    throw new Error("No data to update");
  }

  query += updates.join(", ");

  if (store_id) {
    query += " WHERE id=? AND store_id=?";
    params.push(id, store_id);
  } else {
    query += " WHERE id=?";
    params.push(id);
  }

  const [result] = await db.query(query, params);
  return result;
};

// DELETE
exports.remove = async (id, store_id) => {
  let result;
  if (store_id) {
    [result] = await db.query(
      "DELETE FROM customers WHERE id=? AND store_id=?",
      [id, store_id],
    );
  } else {
    [result] = await db.query("DELETE FROM customers WHERE id=?", [id]);
  }

  return result;
};
