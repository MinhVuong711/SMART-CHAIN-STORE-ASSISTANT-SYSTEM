const express = require("express");
const router = express.Router();

const controller = require("../controllers/customer.controller");
const { verifyToken, checkRole } = require("../../shared/auth.middleware");

// CREATE → staff
router.post("/", verifyToken, checkRole(["staff"]), controller.create);

// GET ALL → admin + staff
router.get("/", verifyToken, checkRole(["admin", "staff"]), controller.getAll);

// GET BY ID → admin + staff
router.get(
  "/:id",
  verifyToken,
  checkRole(["admin", "staff"]),
  controller.getById,
);

// UPDATE → admin + staff
router.put(
  "/:id",
  verifyToken,
  checkRole(["admin", "staff"]),
  controller.update,
);

// DELETE → chỉ admin
router.delete("/:id", verifyToken, checkRole(["admin"]), controller.remove);

module.exports = router;
