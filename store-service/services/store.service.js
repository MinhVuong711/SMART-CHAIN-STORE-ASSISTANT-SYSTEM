const db = require("../db");
const redis = require("../utils/redis");

// helper clear cache
async function clearStoreCache() {
  const stream = redis.scanIterator({
    MATCH: "stores:*",
    COUNT: 100,
  });

  const keys = [];
  for await (const key of stream) {
    keys.push(key);
  }

  if (keys.length > 0) {
    await redis.del(keys);
  }
}

// CREATE STORE
exports.create = async (data) => {
  let { name, address } = data;

  name = name?.trim();
  address = address?.trim();

  // validate chuẩn hơn
  if (!name || name.length === 0) {
    throw new Error("Store name is required");
  }

  try {
    const [result] = await db.query(
      "INSERT INTO stores (name, address) VALUES (?, ?)",
      [name, address || null],
    );

    await clearStoreCache();

    return {
      message: "Store created",
      id: result.insertId,
    };
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      throw new Error("Store name already exists");
    }
    throw err;
  }
};

// GET ALL
exports.getAll = async (page = 1, limit = 10) => {
  const cacheKey = `stores:${page}:${limit}`;

  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const offset = (page - 1) * limit;

  const [rows] = await db.query(
    "SELECT * FROM stores WHERE is_deleted=0 ORDER BY id DESC LIMIT ? OFFSET ?",
    [limit, offset],
  );

  await redis.set(cacheKey, JSON.stringify(rows), {
    EX: 60,
  });

  return rows;
};

// GET BY ID
exports.getById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM stores WHERE id=? AND is_deleted=0",
    [id],
  );

  return rows[0];
};

// UPDATE
exports.update = async (id, data) => {
  let updates = [];
  let params = [];

  if (data.name !== undefined) {
    const name = data.name.trim();

    if (!name) {
      throw new Error("Store name cannot be empty");
    }

    updates.push("name=?");
    params.push(name);
  }

  if (data.address !== undefined) {
    updates.push("address=?");
    params.push(data.address.trim());
  }

  if (updates.length === 0) {
    throw new Error("No data to update");
  }

  let query = `UPDATE stores SET ${updates.join(", ")} WHERE id=?`;
  params.push(id);

  const [result] = await db.query(query, params);

  await clearStoreCache();

  return result;
};

// DELETE (soft delete)
exports.remove = async (id) => {
  const [result] = await db.query("UPDATE stores SET is_deleted=1 WHERE id=?", [
    id,
  ]);

  await clearStoreCache();

  return result;
};
