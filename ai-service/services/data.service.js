const axios = require("axios");

const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL;
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL;
const CUSTOMER_SERVICE_URL = process.env.CUSTOMER_SERVICE_URL;
const ANALYTICS_SERVICE_URL = process.env.ANALYTICS_SERVICE_URL;

// Lấy summary từ analytics service
exports.getSummary = async (store_id, token) => {
  const res = await axios.get(
    `${ANALYTICS_SERVICE_URL}/analytics/summary?store_id=${store_id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 5000,
    },
  );
  return res.data;
};

// Lấy doanh thu
exports.getRevenue = async (store_id, token) => {
  const res = await axios.get(
    `${ANALYTICS_SERVICE_URL}/analytics/revenue?store_id=${store_id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 5000,
    },
  );
  return res.data;
};

// Lấy doanh thu theo ngày
exports.getDailyRevenue = async (store_id, token) => {
  const res = await axios.get(
    `${ANALYTICS_SERVICE_URL}/analytics/revenue/daily?store_id=${store_id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 5000,
    },
  );
  return res.data;
};

// Lấy top sản phẩm
exports.getTopProducts = async (store_id, token) => {
  const res = await axios.get(
    `${ANALYTICS_SERVICE_URL}/analytics/top-products?store_id=${store_id}&limit=5`,
    {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 5000,
    },
  );
  return res.data;
};

// Lấy danh sách orders
exports.getOrders = async (store_id, token) => {
  const res = await axios.get(
    `${ORDER_SERVICE_URL}/orders?store_id=${store_id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 5000,
    },
  );
  return res.data;
};

// Lấy danh sách customers
exports.getCustomers = async (store_id, token) => {
  const res = await axios.get(`${CUSTOMER_SERVICE_URL}/customers`, {
    headers: { Authorization: `Bearer ${token}` },
    timeout: 5000,
  });
  return res.data;
};

// Lấy danh sách products
exports.getProducts = async (store_id) => {
  const res = await axios.get(`${PRODUCT_SERVICE_URL}/${store_id}/products`, {
    timeout: 5000,
  });
  return res.data;
};
