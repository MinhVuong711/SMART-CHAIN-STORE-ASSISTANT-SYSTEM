const express = require("express");
const router = express.Router();

const controller = require("../controllers/analytics.controller");
const { verifyToken, checkRole } = require("../../shared/auth.middleware");

// Tất cả analytics đều cần đăng nhập
// Admin xem tất cả, staff chỉ xem store mình

// Tổng doanh thu
router.get(
  "/revenue",
  verifyToken,
  checkRole(["admin", "staff"]),
  controller.getRevenue,
);

// Doanh thu theo ngày
router.get(
  "/revenue/daily",
  verifyToken,
  checkRole(["admin", "staff"]),
  controller.getDailyRevenue,
);

// Top sản phẩm bán chạy
router.get(
  "/top-products",
  verifyToken,
  checkRole(["admin", "staff"]),
  controller.getTopProducts,
);

// Tổng hợp tất cả
router.get(
  "/summary",
  verifyToken,
  checkRole(["admin", "staff"]),
  controller.getSummary,
);

module.exports = router;
