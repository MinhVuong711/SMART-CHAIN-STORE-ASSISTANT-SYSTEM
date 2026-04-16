const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL;
const CUSTOMER_SERVICE_URL = process.env.CUSTOMER_SERVICE_URL;

const db = require("../db");
const axios = require("axios");

// CREATE ORDER
exports.create = async (user, data) => {
  const { items, customer_id } = data;

  // VALIDATE CUSTOMER
  try {
    await axios.get(`${CUSTOMER_SERVICE_URL}/customers/${customer_id}`);
  } catch (err) {
    throw new Error("Customer not found");
  }

  // 🔥 2. VALIDATE items tồn tại
  if (!items || items.length === 0) {
    throw new Error("Order must have items");
  }

  let total = 0;
  let productList = [];

  // LẤY store chuẩn từ items
  const firstStore = Number(items[0].store_id);
  // CHECK USER CÓ QUYỀN STORE KHÔNG
  if (firstStore !== user.store_id) {
    throw new Error("Unauthorized store access");
  }

  if (!Number.isInteger(firstStore)) {
    throw new Error("Invalid store_id");
  }

  // 🔥 4. VALIDATE + CHECK STORE CONSISTENCY
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

    // 🔥 đảm bảo tất cả cùng store
    if (storeId !== firstStore) {
      throw new Error("All items must belong to same store");
    }
  }

  // 🔥 5. LẤY PRICE từ product-service (không trust client)
  for (let item of items) {
    try {
      const res = await axios.get(
        `${PRODUCT_SERVICE_URL}/stores/${item.store_id}/products/${item.product_id}`,
      );

      const product = res.data;
      const price = product.price;

      total += price * item.quantity;

      productList.push({
        product_id: item.product_id,
        price,
        quantity: item.quantity,
      });
    } catch (err) {
      throw new Error(`Product not found: ${item.product_id}`);
    }
  }

  // 🔥 6. INSERT ORDER (store_id lấy từ items, KHÔNG lấy từ client)
  const [orderResult] = await db.query(
    "INSERT INTO orders (created_by, customer_id, store_id, total_price, status) VALUES (?, ?, ?, ?, ?)",
    [user.id, customer_id, firstStore, total, "pending"],
  );

  const order_id = orderResult.insertId;

  // 🔥 7. INSERT ORDER DETAILS
  for (let item of productList) {
    await db.query(
      "INSERT INTO order_details (order_id, product_id, price, quantity) VALUES (?, ?, ?, ?)",
      [order_id, item.product_id, item.price, item.quantity],
    );
  }

  return {
    message: "Order created",
    order_id,
    total,
  };
};

// 🔥 GET ALL (MULTI-STORE)
exports.getAll = async (store_id) => {
  const [rows] = await db.query(
    "SELECT * FROM orders WHERE store_id=? ORDER BY id DESC",
    [store_id],
  );

  return rows;
};
