const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL;
const CUSTOMER_SERVICE_URL = process.env.CUSTOMER_SERVICE_URL;

const db = require("../db");
const axios = require("axios");

// CREATE
exports.create = async (user, data, token) => {
  const { items, customer_id } = data;

  // VALIDATE CUSTOMER AND CHECK STORE
  let customerData;
  try {
    const customerRes = await axios.get(
      `${CUSTOMER_SERVICE_URL}/customers/${customer_id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 3000,
      },
    );
    customerData = customerRes.data;
  } catch (err) {
    throw new Error("Customer not found");
  }

  // check store SAU khi axios xong
  if (user.role !== "admin" && customerData.store_id !== user.store_id) {
    throw new Error("Customer does not belong to this store");
  }

  if (!items || items.length === 0) {
    throw new Error("Order must have items");
  }

  let total = 0;
  let productList = [];

  const firstStore = Number(items[0].store_id);

  if (!Number.isInteger(firstStore)) {
    throw new Error("Invalid store_id");
  }

  if (user.role !== "admin" && firstStore !== user.store_id) {
    throw new Error("Unauthorized store access");
  }

  // VALIDATE ITEMS
  for (let item of items) {
    const productId = Number(item.product_id);
    const storeId = Number(item.store_id);
    const quantity = Number(item.quantity);

    if (
      !Number.isInteger(productId) ||
      !Number.isInteger(storeId) ||
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      throw new Error("Invalid item data");
    }

    if (storeId !== firstStore) {
      throw new Error("All items must belong to same store");
    }
  }

  // GET PRODUCT DATA (PARALLEL)
  let productResponses;

  try {
    productResponses = await Promise.all(
      items.map((item) =>
        axios.get(
          `${PRODUCT_SERVICE_URL}/${item.store_id}/products/${item.product_id}`,
          { timeout: 3000 }, // timeout
        ),
      ),
    );
  } catch (err) {
    throw new Error("One or more products not found");
  }

  // CALCULATE TOTAL
  for (let i = 0; i < items.length; i++) {
    const product = productResponses[i].data;
    const price = product.price;

    total += price * items[i].quantity;

    productList.push({
      product_id: items[i].product_id,
      price,
      quantity: items[i].quantity,
    });
  }

  // TRANSACTION START
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // INSERT ORDER
    const [orderResult] = await conn.query(
      "INSERT INTO orders (created_by, customer_id, store_id, total_price, status) VALUES (?, ?, ?, ?, ?)",
      [user.id, customer_id, firstStore, total, "pending"],
    );

    const order_id = orderResult.insertId;

    // INSERT ORDER DETAILS
    for (let item of productList) {
      await conn.query(
        "INSERT INTO order_details (order_id, product_id, price, quantity) VALUES (?, ?, ?, ?)",
        [order_id, item.product_id, item.price, item.quantity],
      );
    }

    await conn.commit();

    return {
      message: "Order created",
      order_id,
      total,
    };
  } catch (err) {
    await conn.rollback(); // rollback nếu lỗi
    throw err;
  } finally {
    conn.release(); // trả connection về pool
  }
};

// GET ALL (MULTI-STORE)
exports.getAll = async (store_id) => {
  const [rows] = await db.query(
    "SELECT * FROM orders WHERE store_id=? ORDER BY id DESC",
    [store_id],
  );

  return rows;
};
