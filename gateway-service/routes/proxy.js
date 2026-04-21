const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
  // AUTH — giữ nguyên vì auth service mount tại /auth
  app.use(
    "/auth",
    createProxyMiddleware({
      target: process.env.AUTH_SERVICE,
      changeOrigin: true,
      pathRewrite: { "^/": "/auth/" }, // ✅
    }),
  );

  // PRODUCTS — strip /products vì mount tại /
  app.use(
    "/products",
    createProxyMiddleware({
      target: process.env.PRODUCT_SERVICE,
      changeOrigin: true,
      pathRewrite: { "^/products": "" }, // ✅
    }),
  );

  // ORDERS — strip /orders vì mount tại /orders
  app.use(
    "/orders",
    createProxyMiddleware({
      target: process.env.ORDER_SERVICE,
      changeOrigin: true,
      pathRewrite: { "^/": "/orders/" }, // ✅
    }),
  );

  // CUSTOMERS — strip /customers vì mount tại /customers
  app.use(
    "/customers",
    createProxyMiddleware({
      target: process.env.CUSTOMER_SERVICE,
      changeOrigin: true,
      pathRewrite: { "^/": "/customers/" }, // ✅
    }),
  );

  app.use(
    "/stores",
    createProxyMiddleware({
      target: process.env.STORE_SERVICE,
      changeOrigin: true,
      pathRewrite: { "^/": "/stores/" }, // ✅ giữ lại /stores/
    }),
  );

  app.use(
    "/analytics",
    createProxyMiddleware({
      target: process.env.ANALYTICS_SERVICE,
      changeOrigin: true,
      pathRewrite: { "^/": "/analytics/" },
    }),
  );

  app.use(
    "/ai",
    createProxyMiddleware({
      target: process.env.AI_SERVICE,
      changeOrigin: true,
      pathRewrite: { "^/": "/ai/" },
    }),
  );
};
