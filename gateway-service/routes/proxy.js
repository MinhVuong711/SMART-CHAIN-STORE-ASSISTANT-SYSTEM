const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
  app.use(
    "/auth",
    createProxyMiddleware({
      target: process.env.AUTH_SERVICE,
      changeOrigin: true,
      pathRewrite: { "^/": "/auth/" }, // ✅
    }),
  );

  app.use(
    "/products",
    createProxyMiddleware({
      target: process.env.PRODUCT_SERVICE,
      changeOrigin: true,
      pathRewrite: { "^/products": "" }, // ✅
    }),
  );

  app.use(
    "/orders",
    createProxyMiddleware({
      target: process.env.ORDER_SERVICE,
      changeOrigin: true,
      pathRewrite: { "^/": "/orders/" }, // ✅
    }),
  );

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
      pathRewrite: { "^/": "/stores/" }, // ✅
    }),
  );
};
