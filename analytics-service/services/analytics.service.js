const axios = require("axios");

const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL;
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL;

// Helper: lấy tất cả orders của store
async function fetchOrders(store_id, token) {
  const res = await axios.get(
    `${ORDER_SERVICE_URL}/orders?store_id=${store_id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 5000,
    },
  );
  return res.data;
}

// Helper: lấy chi tiết 1 order
async function fetchOrderDetails(order_id, token) {
  const res = await axios.get(
    `${ORDER_SERVICE_URL}/orders/${order_id}/details`,
    {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 5000,
    },
  );
  return res.data;
}

// Helper: lấy tất cả products của store
async function fetchProducts(store_id) {
  const res = await axios.get(`${PRODUCT_SERVICE_URL}/${store_id}/products`, {
    timeout: 5000,
  });
  return res.data;
}

// GET REVENUE — tổng doanh thu + đếm đơn hàng
exports.getRevenue = async (store_id, token) => {
  const orders = await fetchOrders(store_id, token);

  const totalRevenue = orders.reduce((sum, order) => {
    return sum + Number(order.total_price);
  }, 0);

  return {
    store_id,
    total_orders: orders.length,
    total_revenue: totalRevenue,
  };
};

// GET DAILY REVENUE — doanh thu theo từng ngày
exports.getDailyRevenue = async (store_id, token) => {
  const orders = await fetchOrders(store_id, token);

  // Group theo ngày
  const dailyMap = {};

  for (const order of orders) {
    // Lấy ngày từ created_at
    const date = new Date(order.created_at).toISOString().split("T")[0];

    if (!dailyMap[date]) {
      dailyMap[date] = {
        date,
        total_orders: 0,
        total_revenue: 0,
      };
    }

    dailyMap[date].total_orders += 1;
    dailyMap[date].total_revenue += Number(order.total_price);
  }

  // Sort theo ngày mới nhất
  const result = Object.values(dailyMap).sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  return result;
};

// GET TOP PRODUCTS — dùng order details thật ✅
exports.getTopProducts = async (store_id, limit = 5, token) => {
  const orders = await fetchOrders(store_id, token);

  if (orders.length === 0) {
    return { store_id, top_products: [] };
  }

  // Lấy details của tất cả orders song song - 1 order fail vẫn chạy tiếp
  const allSettled = await Promise.allSettled(
    orders.map((order) => fetchOrderDetails(order.id, token)),
  );

  const allDetails = allSettled
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value);

  // Gộp tất cả items lại, đếm số lượng bán theo product
  const productSales = {};

  for (const detail of allDetails) {
    for (const item of detail.items) {
      const pid = item.product_id;

      if (!productSales[pid]) {
        productSales[pid] = {
          product_id: pid,
          total_quantity: 0,
          total_revenue: 0,
        };
      }

      productSales[pid].total_quantity += item.quantity;
      productSales[pid].total_revenue += Number(item.price) * item.quantity;
    }
  }

  // Lấy tên product từ product-service
  const products = await fetchProducts(store_id);
  const productMap = {};
  for (const p of products) {
    productMap[p.id] = p.name;
  }

  // Sort theo số lượng bán, lấy top N
  const result = Object.values(productSales)
    .sort((a, b) => b.total_quantity - a.total_quantity)
    .slice(0, limit)
    .map((p) => ({
      product_id: p.product_id,
      name: productMap[p.product_id] || "Unknown",
      total_quantity: p.total_quantity,
      total_revenue: p.total_revenue,
    }));

  return {
    store_id,
    top_products: result,
  };
};

// GET SUMMARY — tổng hợp tất cả
exports.getSummary = async (store_id, token) => {
  // Gọi song song để nhanh hơn
  const [orders, products] = await Promise.all([
    fetchOrders(store_id, token),
    fetchProducts(store_id),
  ]);

  const totalRevenue = orders.reduce(
    (sum, o) => sum + Number(o.total_price),
    0,
  );

  // Doanh thu hôm nay
  const today = new Date().toISOString().split("T")[0];
  const todayOrders = orders.filter((o) => {
    const orderDate = new Date(o.created_at).toISOString().split("T")[0];
    return orderDate === today;
  });

  const todayRevenue = todayOrders.reduce(
    (sum, o) => sum + Number(o.total_price),
    0,
  );

  return {
    store_id,
    total_orders: orders.length,
    total_revenue: totalRevenue,
    today_orders: todayOrders.length,
    today_revenue: todayRevenue,
    total_products: products.length,
  };
};
