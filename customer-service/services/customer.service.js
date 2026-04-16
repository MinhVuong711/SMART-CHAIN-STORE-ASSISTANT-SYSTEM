const db = require("../db");

// CREATE
exports.create = async (data) => {
    const { name, phone, email } = data;

    const [result] = await db.query(
        "INSERT INTO customers (name, phone, email) VALUES (?, ?, ?)",
        [name, phone, email]
    );

    return { id: result.insertId };
};

// GET ALL
exports.getAll = async () => {
    const [rows] = await db.query("SELECT * FROM customers");
    return rows;
};

// GET BY ID
exports.getById = async (id) => {
    const [rows] = await db.query(
        "SELECT * FROM customers WHERE id = ?",
        [id]
    );
    return rows[0];
};

// UPDATE
exports.update = async (id, data) => {
    const { name, phone, email, type } = data;

    await db.query(
        "UPDATE customers SET name=?, phone=?, email=?, type=? WHERE id=?",
        [name, phone, email, type, id]
    );
};

// DELETE
exports.remove = async (id) => {
    await db.query("DELETE FROM customers WHERE id=?", [id]);
};