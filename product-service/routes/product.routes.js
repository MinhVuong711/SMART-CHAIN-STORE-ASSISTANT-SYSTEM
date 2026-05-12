const express = require("express");
const router = express.Router();

const controller = require("../controllers/product.controller");
const { verifyToken, checkRole } = require("../../shared/auth.middleware");

// PUBLIC
router.get("/:store_id/products", controller.getAll);
router.get("/:store_id/products/:id", controller.getById);

// CREATE -> admin + staff
router.post(
  "/:store_id/products",
  verifyToken,
  checkRole(["admin", "staff"]),
  controller.create,
);

// UPDATE -> admin + staff
router.put(
  "/:store_id/products/:id",
  verifyToken,
  checkRole(["admin", "staff"]),
  controller.update,
);

// DELETE -> admin + staff
router.delete(
  "/:store_id/products/:id",
  verifyToken,
  checkRole(["admin", "staff"]),
  controller.remove,
);

module.exports = router;
