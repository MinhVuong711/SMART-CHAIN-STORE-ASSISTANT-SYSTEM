const express = require("express");
const router = express.Router();

const controller = require("../controllers/product.controller");
const { verifyToken, checkRole } = require("../../shared/auth.middleware");

// PUBLIC
router.get("/:store_id/products", controller.getAll);
router.get("/:store_id/products/:id", controller.getById);

// CREATE → chỉ admin
router.post(
  "/:store_id/products",
  verifyToken,
  checkRole(["admin"]),
  controller.create,
);

// UPDATE → chỉ admin
router.put(
  "/:store_id/products/:id",
  verifyToken,
  checkRole(["admin"]),
  controller.update,
);

// DELETE → chỉ admin
router.delete(
  "/:store_id/products/:id",
  verifyToken,
  checkRole(["admin"]),
  controller.remove,
);

module.exports = router;
